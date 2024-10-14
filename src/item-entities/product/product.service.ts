import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/prisma/client';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  cloudinaryService: CloudinaryService;
  constructor() {
    this.cloudinaryService = new CloudinaryService();
  }
  async createProduct(productData) {
    const { file, files, data } = productData;

    if (file) {
      const uploadedFile = await this.cloudinaryService.uploadFile(file);

      data.thumbNail = {
        create: {
          url: uploadedFile.secure_url,
          cloudinary_public_id: uploadedFile.public_id,
        },
      };
    }

    if (files?.length) {
      const uploadedFiles = await Promise.all(
        await this.cloudinaryService.uploadFiles(files),
      );

      data.photos = {
        create: uploadedFiles.map((uploadedFile) => {
          return {
            url: uploadedFile.secure_url,
            cloudinary_public_id: uploadedFile.public_id,
          };
        }),
      };
    }
    return prisma.product.create({ data });
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
    return prisma.productPhoto.delete({ where: { id: data.id } });
  }

  async updateManyProducts(updateQuery: Prisma.ProductUpdateManyArgs) {
    return prisma.product.updateMany(updateQuery);
  }
}
