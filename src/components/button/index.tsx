import { ButtonProps } from './types';

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button type="button" className="button" {...props}>
      {children}
    </button>
  );
}
