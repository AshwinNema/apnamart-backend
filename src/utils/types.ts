import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

export declare type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export type MultiPartData = {
  data: string;
};

export interface ChatWebSocket extends WebSocket {
  id?: string;
}
