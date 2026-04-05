import { type InputHTMLAttributes, type ReactNode } from 'react';

export type LineFieldProps = {
  id: string;
  label: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;
