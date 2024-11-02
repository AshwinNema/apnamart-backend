import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/prisma/client';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import { CreateProductValidation } from 'src/validations';
import {
  createProductProcessedBody,
  databaseDescription,
  stageDescriptionInDatabase,
} from './interfaces';

@Injectable()
export class ProductService {
  cloudinaryService: CloudinaryService;
  constructor() {
    this.cloudinaryService = new CloudinaryService();
  }
  async createProduct(
    body: CreateProductValidation,
    processedBody: createProductProcessedBody,
  ) {
    const uploadedFiles = await Promise.all(
      await this.cloudinaryService.uploadFiles(body.productImages),
    );
    let description: databaseDescription;
    if (typeof processedBody.description.details === 'string') {
      description = { details: processedBody.description.details };
    }
    if (Array.isArray(processedBody.description.details)) {
      let descriptionFiles;
      if (body.descriptionFiles) {
        descriptionFiles = await Promise.all(
          await this.cloudinaryService.uploadFiles(body.descriptionFiles),
        );
      }

      description = {
        details: processedBody.description.details.map((details, index) => {
          const photo = descriptionFiles?.[index];
          const finalDetails: stageDescriptionInDatabase =
            structuredClone(details);
          if (photo) {
            finalDetails.photo = {
              url: photo.secure_url,
              cloudinary_public_id: photo.public_id,
            };
          }

          return finalDetails;
        }),
      };
    }

    return prisma.product.create({
      data: {
        ...processedBody,
        photos: uploadedFiles.map((photo) => {
          return {
            url: photo.secure_url,
            cloudinary_public_id: photo.public_id,
            name: photo.name,
          };
        }),
        description,
      },
    });
  }

  async updateManyProducts(updateQuery: Prisma.ProductUpdateManyArgs) {
    return prisma.product.updateMany(updateQuery);
  }

  async getProductFilters(id: number) {
    return prisma.product.findUnique({
      where: { id },
      select: {
        filterOptions: {
          select: {
            name: true,
            id: true,
            filter: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });
  }
}
