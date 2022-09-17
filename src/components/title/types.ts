import { HTMLAttributes } from 'react';

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement>{
  children: React.ReactNode,
  level: number
}
