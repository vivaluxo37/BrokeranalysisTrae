export const reportError = (
    error: Error | string,
    context: object = {},
): void => {
    if (import.meta.env.PROD) {
        const contextObj = { 'Custom Context': context };

        if (!import.meta.env.SSR) {
            import('@sentry/react').then((Sentry) => {
                Sentry.captureException(error, {
                    extra: contextObj,
                });
            });
        }
    } else {
        console.error(error, context);
    }
};
