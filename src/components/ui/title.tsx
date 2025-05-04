import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'sm' | 'md' | 'lg' | 'base';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Title: React.FC<TitleProps> = ({
  children,
  size = 'md',
  as = 'h1',
  className,
  ...props
}) => {
  const Component = as;

  const sizeClasses = {
    sm: 'text-base sm:text-[18px] lg:text-[20px] font-normal',
    md: 'text-xl lg:text-2xl',
    base: 'text-xl md:text-2xl lg:text-3xl',
    lg: 'text-3xl font-bold md:text-4xl lg:text-5xl',
  };

  return (
    <Component
      className={cn(
        'w-full font-semibold tracking-tight text-secondary-foreground dark:text-neutral-200',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Title };
