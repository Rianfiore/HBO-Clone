import { InputProps } from './types';

export function Input({ info, ...props }: InputProps) {
  return (
    <div className="label">
      <input className="label__input" {...props} />
      {info !== undefined && <p className="label__info">{info}</p>}
    </div>
  );
}
