import React, { type ButtonHTMLAttributes } from 'react';
import styles from './button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'inverted';
  size?: 'lg' | 'sm' | 'md';
  wide?: boolean;
  minwide?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'gradient',
  size = 'lg',
  wide = false,
  minwide = false,
  children,
  className,
  ...htmlButtonProps
}: ButtonProps) {
  const classNames = [styles[variant], styles[size]];

  if (wide) {
    classNames.push(styles.wide);
  }

  if (className) {
    classNames.push(className);
  }

  return (
    <button className={classNames.join(' ')} {...htmlButtonProps}>
      <span>{children}</span>
    </button>
  );
}
