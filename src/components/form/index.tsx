import { FormProps } from './types';

export function Form({ children, ...props }: FormProps) {
  return (
    <form className="form" {...props}>
      {children}
    </form>
  );
}
