import { ModalProps } from './types';
import * as S from './styles';

export function Modal({ children }: ModalProps) {
  return <S.Modal className="modal">{children}</S.Modal>;
}
