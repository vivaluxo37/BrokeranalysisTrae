type Invalid<T> = ['Needs to be all of', T];

/**
 * https://stackoverflow.com/a/53395649
 */
export const arrayOfAll =
    <T>() =>
    <U extends T[]>(
        ...array: U & ([T] extends [U[number]] ? unknown : Invalid<T>[])
    ) =>
        array;
