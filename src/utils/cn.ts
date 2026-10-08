/** Joins class names, skipping falsy ones: cn('a', isOn && 'b'). */
export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');
