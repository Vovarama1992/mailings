import { ReactNode, ChangeEvent } from 'react';

export type Mailings = {
    id: string;
    name: string;
    date: string;
    number: number | string;
}
export type OnlyEssential = Omit<Mailings, 'id'>;
export type MailingProps = {
    id: string;
    item: string;
    date: string;
    number: string | number;
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
