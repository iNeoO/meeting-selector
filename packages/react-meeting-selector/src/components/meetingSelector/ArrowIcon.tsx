import { type HTMLAttributes, memo } from 'react';

export type ArrowIconProps = {
  direction: 'up' | 'down' | 'left' | 'right';
} & HTMLAttributes<HTMLElement>;

const ArrowIconComponent = ({ direction, className, ...props }: ArrowIconProps) => {
  const iconDirectionClass = `meeting-selector__icon-${direction}`;
  return (
    <i
      role="img"
      className={`meeting-selector__icon ${iconDirectionClass} ${className ?? ''}`}
      {...props}
    />
  );
};

export const ArrowIcon = memo(ArrowIconComponent);
