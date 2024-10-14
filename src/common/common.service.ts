import { Injectable } from '@nestjs/common';
import prisma from 'src/prisma/client';
import { getPaginationOptions } from 'src/utils';

export interface paginationOptions {
  limit?: number;
  page?: number;
}

@Injectable()
export class CommonService {
  async queryData(
    modelName: string,
    { limit, page }: paginationOptions,
    queryOptions?: {
      [key: string]: any;
      where?: object;
    },
  ) {
    const paginationOptions = getPaginationOptions(page, limit);
    const [results, totalResults] = await prisma.$transaction([
      prisma?.[modelName].findMany({
        ...paginationOptions,
        orderBy: {
          createdAt: 'desc',
        },
        ...queryOptions,
      }),
      prisma?.[modelName].count({
        where: queryOptions.where || {},
      }),
    ]);

    return {
      results,
      totalResults,
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit),
    };
  }
}
