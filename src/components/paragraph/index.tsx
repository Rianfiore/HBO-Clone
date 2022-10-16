import { ParagraphProps } from './types';

export function Paragraph({ children }: ParagraphProps) {
  return <p className="paragraph">{children}</p>;
}
