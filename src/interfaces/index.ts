import { UserRole } from '@prisma/client';

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  password: string;
  userRoles: UserRole[];
  phoneNo: string;
  photo: string;
  cloudinary_public_id: string;
  createdAt: Date;
  updatedAt: Date;
  isBlackListed: boolean;
  archive: boolean;
}

export interface ValidatedObject {
  error: boolean;
  message: string;
}

export interface CreateCategoryData {
  name: string;
}

export interface SubCategoryInterface {
  name: string;
  categoryId: number;
}

export interface CreateFilterOption {
  name: string;
  createdBy: number;
}

export interface CreateFilter {
  name: string;
  createdBy: number;
  options: CreateFilterOption[];
}

export interface CreateItemData {
  name: string;
  subCategoryId: number;
  filters: CreateFilter[];
}
