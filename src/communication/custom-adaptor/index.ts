import {
  BadRequestException,
  INestApplicationContext,
  Logger,
  WsMessageHandler,
} from '@nestjs/common';
import { AbstractWsAdapter } from '@nestjs/websockets';
import * as constants from '@nestjs/websockets/constants';
import { Server } from 'ws';
import http from 'http';
import { normalizePath, isNil } from '@nestjs/common/utils/shared.utils';
import { fromEvent, Observable, EMPTY } from 'rxjs';
import operators, { filter, mergeMap, takeUntil } from 'rxjs/operators';

const READY_STATE = {
  '0': 'CONNECTING_STATE',
  '1': 'OPEN_STATE',
  '2': 'CLOSING_STATE',
  '3': 'CLOSED_STATE',
  CONNECTING_STATE: 0,
  OPEN_STATE: 1,
  CLOSING_STATE: 2,
  CLOSED_STATE: 3,
};

const UNDERLYING_HTTP_SERVER_PORT = 0;

export class WsAdapter extends AbstractWsAdapter {
  private readonly logger: Logger;
  httpServersRegistry: Map<number, http.Server>;
  wsServersRegistry: Map<number, Server[]>;
  constructor(public appOrHttpServer: INestApplicationContext) {
    super(appOrHttpServer);
    this.httpServersRegistry = new Map();
    this.wsServersRegistry = new Map();
    this.logger = new Logger(WsAdapter.name);
  }

  create(port: number, options?: any) {
    const { server, path, ...wsOptions } = options;
    if (wsOptions?.namespace) {
      throw new BadRequestException(
        '"WsAdapter" does not support namespaces. If you need namespaces in your project, consider using the "@nestjs/platform-socket.io" package instead.',
      );
    }
    if (port === UNDERLYING_HTTP_SERVER_PORT && this.httpServer) {
      this.ensureHttpServerExists(port, this.httpServer);
      const wsServer = this.bindErrorHandler(
        new Server({
          noServer: true,
          ...wsOptions,
        }),
      );
      this.addwsServerToRegistry(wsServer, port, path);
      return wsServer;
    }
    if (server) return server;
    if (path && port !== UNDERLYING_HTTP_SERVER_PORT) {
      // Multiple servers with different paths
      // sharing a single HTTP/S server running on different port
      // than a regular HTTP application
      const httpServer = this.ensureHttpServerExists(port);
      httpServer?.listen(port);
      const wsServer = this.bindErrorHandler(
        new Server({
          noServer: true,
          ...wsOptions,
        }),
      );
      this.addwsServerToRegistry(wsServer, port, path);
      return wsServer;
    }
    const wsServer = this.bindErrorHandler(
      new Server({
        port,
        path,
        ...wsOptions,
      }),
    );
    return wsServer;
  }

  bindMessageHandlers(
    client: WebSocket,
    handlers: WsMessageHandler[],
    transform: (data: any) => Observable<any>,
  ) {
    const handlersMap = new Map();
    handlers.forEach((handler) => handlersMap.set(handler.message, handler));
    const close = fromEvent(client, constants.CLOSE_EVENT).pipe(
      operators.share(),
      operators.first(),
    );
    const source = fromEvent(client, 'message').pipe(
      mergeMap((data) =>
        this.bindMessageHandler(data, handlersMap, transform).pipe(
          filter((result) => !isNil(result)),
        ),
      ),
      takeUntil(close),
    );

    const onMessage = (response) => {
      if (client.readyState !== READY_STATE.OPEN_STATE) return;
      client.send(JSON.stringify(response));
    };
    source.subscribe(onMessage);
  }

  bindMessageHandler(buffer, handlersMap, transform) {
    try {
      const message = JSON.parse(buffer.data);
      const messageHandler = handlersMap.get(message.event);
      const { callback } = messageHandler;
      return transform(callback(message.data, message.event));
    } catch {
      return EMPTY;
    }
  }

  bindErrorHandler(server: Server) {
    server.on(constants.CONNECTION_EVENT, (ws) => {
      ws.on(constants.ERROR_EVENT, (err) => this.logger.error(err));
    });
    server.on(constants.ERROR_EVENT, (err) => this.logger.error(err));
    return server;
  }

  bindClientDisconnect(client: any, callback: (...args: any) => any): void {
    client.on(constants.CLOSE_EVENT, callback);
  }

  async close(server) {
    const closeEventSignal = new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve(undefined)));
    });

    for (const ws of server.clients) {
      ws.terminate();
    }
    await closeEventSignal;
  }

  async dispose(): Promise<void> {
    const closeEventSignals = Array.from(this.httpServersRegistry)
      .filter(([port]) => port !== UNDERLYING_HTTP_SERVER_PORT)
      .map(([_, server]) => new Promise((resolve) => server.close(resolve)));
    await Promise.all(closeEventSignals);
    this.httpServersRegistry.clear();
    this.wsServersRegistry.clear();
  }

  ensureHttpServerExists(port: number, httpServer = http.createServer()) {
    if (this.httpServersRegistry.has(port)) return;
    this.httpServersRegistry.set(port, httpServer);
    httpServer.on('upgrade', (request, socket, head) => {
      try {
        const baseUrl = 'ws://' + request.headers.host + '/';
        const pathName = new URL(request.url, baseUrl).pathname;
        const wsServerCollection = this.wsServersRegistry.get(port);
        let isRequestDeleted = false;
        for (const wsServer of wsServerCollection) {
          if (pathName === wsServer.path) {
            wsServer.handleUpgrade(request, socket, head, (ws) => {
              wsServer.emit('connection', ws, request);
            });
            isRequestDeleted = true;
            break;
          }
        }
        if (!isRequestDeleted) {
          socket.destroy();
        }
      } catch (err) {
        socket.end('HTTP/1.1 400\r\n' + err.message);
      }
    });
    return httpServer;
  }

  addwsServerToRegistry(wsServer: Server, port: number, path: string) {
    const entries = this.wsServersRegistry.get(port) ?? [];
    entries.push(wsServer);
    wsServer.path = normalizePath(path);
    this.wsServersRegistry.set(port, entries);
  }
}
