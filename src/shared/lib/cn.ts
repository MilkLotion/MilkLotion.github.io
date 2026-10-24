import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** 조건부 클래스 합치기 + Tailwind 충돌 클래스 정리 (shadcn 표준 유틸) */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
