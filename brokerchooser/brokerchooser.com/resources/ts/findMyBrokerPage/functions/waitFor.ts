export const waitFor = (ms: number) =>
    new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
