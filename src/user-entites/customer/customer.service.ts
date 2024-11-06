import { Injectable } from '@nestjs/common';
import prisma from 'src/prisma/client';

@Injectable()
export class CustomerService {
  async getCategorySubCategoryItemMenu() {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        photo: true,
        subCategory: {
          select: {
            id: true,
            name: true,
            items: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
