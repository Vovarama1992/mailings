import { ReactNode, ChangeEvent } from 'react';

export type Mailings = {
    id: string;
    name: string;
    date: string;
    number: number | string;
    gifts: string;
}
export type Gift = {
  name: string;
  expiry_date: string;
  price: number;
}
export type OnlyEssential = Omit<Mailings, 'id'>;
export type MailingProps = {
    id: string;
    item: string;
    date: string;
    number: string | number;
    query: string;
}



export type RootLayoutProps = {
  children: ReactNode;
}
export type InputProps = {
  
  index: number;
  value: string;
  onInput: onInputChange;
}
export type onInputChange = (e: ChangeEvent<HTMLInputElement>) => void;
