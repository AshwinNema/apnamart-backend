import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/prisma/client';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import { CreateProductValidation } from 'src/validations';

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
    let additionalDescriptionDetails: {
      photos?: {
        url: string;
        cloudinary_public_id: string;
        name: string;
      }[];
    } = {};

    if (body.descriptionFiles) {
      const descriptionFiles = await Promise.all(
        await this.cloudinaryService.uploadFiles(body.descriptionFiles),
      );
      additionalDescriptionDetails.photos = descriptionFiles.map((photo) => {
        return {
          url: photo.secure_url,
          cloudinary_public_id: photo.public_id,
          name: photo.original_filename,
        };
      });
    }

    return prisma.product.create({
      data: {
        ...processedBody,
        photos: uploadedFiles.map((photo) => {
          return {
            url: photo.secure_url,
            cloudinary_public_id: photo.public_id,
            name: photo.original_filename,
          };
        }),
        description: {
          ...processedBody.description,
          ...additionalDescriptionDetails,
        },
      },
    });
  }

  updateProductById(where, update) {
    return prisma.product.update({ where, data: update });
  }

  async updateResouce(data, file) {
    await this.cloudinaryService.deleteFile(data.cloudinary_public_id);
    return this.cloudinaryService.updatePrismaEntityFile(
      'productPhoto',
      data.id,
      file,
      'url',
    );
  }

  async deletePhoto(data) {
    await this.cloudinaryService.deleteFile(data.cloudinary_public_id);
    // return prisma.productPhoto.delete({ where: { id: data.id } });
  }

  async updateManyProducts(updateQuery: Prisma.ProductUpdateManyArgs) {
    return prisma.product.updateMany(updateQuery);
  }
}
