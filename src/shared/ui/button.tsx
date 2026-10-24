import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';

/**
 * shadcn Button — 사이트 공통
 * - 알약 모양(rounded-full)이 기본. 랜딩 다운로드 버튼과 같은 모양
 * - `onDark`: 짙은 히어로 배경 위 버튼
 */
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        outline: 'border border-border bg-card text-foreground hover:bg-accent',
        ghost: 'text-foreground hover:bg-accent',
        link: 'h-auto px-0 text-primary underline-offset-4 hover:underline',
        onDark: 'bg-white text-brand-deep hover:bg-white/90',
        onDarkOutline: 'border border-white/30 bg-transparent text-white hover:bg-white/10',
        onDarkGhost: 'text-white/85 hover:bg-white/10 hover:text-white',
      },
      size: {
        sm: 'h-9 px-4 text-sm [&_svg]:size-4',
        default: 'h-11 px-5 text-[15px] [&_svg]:size-4',
        lg: 'h-13 px-6 text-base [&_svg]:size-[18px]',
        icon: 'size-10 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** 자식 요소(a 등)에 버튼 스타일만 입힘 */
    asChild?: boolean;
  };

export const Button = ({ className, variant, size, asChild = false, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot.Root : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};
