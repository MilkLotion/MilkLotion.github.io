import { Check, ChevronDown } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';

/**
 * shadcn Select — 쓰는 부분만 (Root · Trigger · Value · Content · Item)
 * - 네이티브 select 는 다크 모드에서 화살표·목록이 브라우저 기본 모양이라 대신 씀
 * - 트리거는 알약 모양, 높이 40px — 같은 줄 입력칸·버튼과 맞춤
 * - 선택된 항목은 tonal 배경 + 체크 (테두리 강조 없음)
 */
export const Select = (props: ComponentProps<typeof SelectPrimitive.Root>) => <SelectPrimitive.Root data-slot="select" {...props} />;

export const SelectValue = (props: ComponentProps<typeof SelectPrimitive.Value>) => (
  <SelectPrimitive.Value data-slot="select-value" {...props} />
);

export const SelectTrigger = ({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Trigger>) => (
  <SelectPrimitive.Trigger
    data-slot="select-trigger"
    className={cn(
      'inline-flex h-10 cursor-pointer items-center justify-between gap-2 rounded-full border border-border bg-background pr-3 pl-4 text-sm whitespace-nowrap outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[placeholder]:text-muted-foreground',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

export const SelectContent = ({
  className,
  children,
  position = 'popper',
  sideOffset = 6,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      data-slot="select-content"
      position={position}
      sideOffset={sideOffset}
      className={cn(
        'z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

export const SelectItem = ({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) => (
  <SelectPrimitive.Item
    data-slot="select-item"
    className={cn(
      'relative flex cursor-pointer items-center rounded-lg py-2 pr-8 pl-3 text-sm outline-none select-none data-[highlighted]:bg-accent data-[state=checked]:font-semibold',
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-2.5 flex items-center">
      <Check aria-hidden="true" className="size-4 text-primary" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
);
