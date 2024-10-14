import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MerchantRegistrationStatus,
  NotificationEntity,
  Prisma,
} from '@prisma/client';
import { NotificationService } from 'src/communication/notification/notification.service';
import prisma from 'src/prisma/client';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/utils/types';
import { MerchantRegistrationDetails } from 'src/validations';

@Injectable()
export class MerchantRegistrationService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private notificationService: NotificationService,
  ) {}

  async createRegistration(
    body: Prisma.MerchantDetailsCreateInput,
    file: Express.Multer.File,
  ) {
    const uploadedFile: CloudinaryResponse =
      await this.cloudinaryService.uploadFile(file);

    const registration = await prisma.merchantDetails.create({
      data: {
        ...body,
        photo: uploadedFile.secure_url,
        cloudinary_public_id: uploadedFile.public_id,
      },
      omit: {
        cloudinary_public_id: true,
      },
    });

    await this.notificationService.createNotification({
      description: `New business is registered - ${registration.name}. Please review details`,
      entity: NotificationEntity.merchant_registration,
      entityModelId: registration.id,
    });

    return registration;
  }

  async updateRegistrationImg(userId: number, file: Express.Multer.File) {
    const registrationData =
      await this.cloudinaryService.deletePrismaEntityFile(
        'merchantDetails',
        undefined,
        {
          userId,
          registrationStatus: {
            not: MerchantRegistrationStatus.review_by_admin,
          },
        },
        'Cannot update image while admin is reviewing your details',
      );

    return this.cloudinaryService.updatePrismaEntityFile(
      'merchantDetails',
      registrationData.id,
      file,
    );
  }

  async updateMerchantRegistration(
    userId: number,
    body: MerchantRegistrationDetails,
    whereCond: object = {},
    err = 'Merchant Registration not found',
  ) {
    let data;
    try {
      data = await prisma.merchantDetails.update({
        where: {
          userId,
          ...whereCond,
        },
        data: body,
      });
    } catch (_) {
      throw new BadRequestException(err);
    }

    return data;
  }
}
