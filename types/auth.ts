import { Request } from 'express';

export interface RequestWithUserId extends Request {
  userId?: string;
}

export interface Company {
  country: string;
  name: string;
  website: string;
  imageURL?: string;
  hrb: string;
}
