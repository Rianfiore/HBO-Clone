import React from 'react';
import { TitleProps } from './types';

export function Title({ children, level, ...props } : TitleProps) {
  return (
    React.createElement(`h${level}`, {
      className: 'title',
      ...props,
    }, children)
  );
}
