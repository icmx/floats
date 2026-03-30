import type { InputHTMLAttributes, ReactNode } from 'react';

export type LineFieldProps = {
  id: string;
  label: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;
