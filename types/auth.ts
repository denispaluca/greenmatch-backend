import { Request } from 'express';

export interface RequestWithUserId extends Request {
  userId?: string;
  role?: 'supplier' | 'buyer';
}

export interface Company {
  country: string;
  name: string;
  website: string;
  imageURL?: string;
  hrb: string;
}
