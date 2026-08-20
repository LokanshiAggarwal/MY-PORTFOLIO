/**
 * Tailwind class merge helper.
 * Joins class names and filters out falsy values.
 */
export type ClassValue = string | number | null | undefined | boolean;

export const cn = (...classes: ClassValue[]): string =>
  classes
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

