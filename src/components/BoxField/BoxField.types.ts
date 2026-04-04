import { type InputHTMLAttributes, type ReactNode } from 'react';

export type BoxFieldProps = {
  id: string;
  label: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;
