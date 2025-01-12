import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div';
}

const Text: React.FC<TextProps> = ({
  children,
  as = 'p',
  className,
  ...props
}) => {
  const Component = as;

  return (
    <Component
      className={cn(
        'text text-xs sm:text-sm md:text-base', // Default text styles
        className // Allow for additional custom styles
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Text };
