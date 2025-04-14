import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface StepProps {
  icon: ReactNode;
  title: string;
  status: 'pending' | 'complete';
}