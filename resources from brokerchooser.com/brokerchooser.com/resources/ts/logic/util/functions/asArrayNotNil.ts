import { isNotNil } from './isNotNil';

export function asArrayNotNil<T>(
    value: T | readonly T[] | undefined | null,
): T[] {
    if (Array.isArray(value)) {
        return value;
    }

    if (isNotNil(value)) {
        return [value] as T[];
    }

    return [];
}
