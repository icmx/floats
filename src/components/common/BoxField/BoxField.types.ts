import type { InputHTMLAttributes, ReactNode } from 'react';

export type BoxFieldProps = {
  id: string;
  label: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;
