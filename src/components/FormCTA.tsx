import { FixedBottomCTA } from 'ishopcare-lib';
import { ReactNode } from 'react';

interface Props {
  isValid: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function FormCTA({ isValid, onClick, children }: Props) {
  return (
    <FixedBottomCTA
      theme={!isValid ? 'dark' : 'primary'}
      disabled={!isValid}
      style={!isValid ? 'weak' : 'fill'}
      onClick={onClick}
    >
      {children}
    </FixedBottomCTA>
  );
}
