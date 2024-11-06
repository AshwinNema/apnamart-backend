import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserInterface } from 'src/interfaces';
import prisma from 'src/prisma/client';
import { CloudinaryService } from 'src/uploader/cloudinary/cloudinary.service';
import { GetUserProfile } from 'src/validations';

@Injectable()
export class UserService {
  ola_api_key: string;

  constructor(
    private cloudinaryService: CloudinaryService,
    private configService: ConfigService,
  ) {
    this.ola_api_key = this.configService.get('ola_maps').api_key;
  }

  async createUser(data): Promise<UserInterface | UserInterface[]> {
    const newUser = await prisma.user.create({
      data,
    });

    return newUser;
  }

  async findUnique(filter, options = {}): Promise<UserInterface> {
    const user = await prisma.user.findUnique({
      where: filter,
      ...options,
    });

    return user;
  }

  async updateUser(where, data) {
    const updatedUser = await prisma.user.update({
      where,
      data,
    });
    return updatedUser;
  }

  async updateProfileImg(user: UserInterface, file: Express.Multer.File) {
    if (user.cloudinary_public_id) {
      await this.cloudinaryService.deleteFile(user.cloudinary_public_id);
    }

    return this.cloudinaryService.updatePrismaEntityFile('user', user.id, file);
  }

  async getUserProfile(id: number, query: GetUserProfile) {
    const options: {
      include: {
        [key: string]: boolean;
      };
    } = {
      include: {
        address: true,
      },
    };

    if (query.getMerchantDetails) {
      options.include.merchantDetails = true;
    }
    return this.findUnique({ id }, options);
  }
}
