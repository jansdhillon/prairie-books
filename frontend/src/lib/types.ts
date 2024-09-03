import { ReactNode } from 'react';

export type BookType = {
  id: string;
  title: string;
  author: string;
  genre: string;
  publicationDate: Date;
  soldTo: User;
  created: Date;
  updated: number;
  price: number;
  cover: string;
}

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  created: Date;
  updated: number;
}
