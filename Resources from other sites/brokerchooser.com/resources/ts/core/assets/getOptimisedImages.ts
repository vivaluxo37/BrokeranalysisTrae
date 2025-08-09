import * as Sentry from '@sentry/react';
import { OptimizedImageSrcSets } from './types';

export const getOptimisedImages = (path: string): OptimizedImageSrcSets => {
    const webp = import.meta.glob('./files/*', {
        query: {
            w: '400;700;900;1200',
            format: 'webp',
            as: 'srcset',
        },
        eager: true,
    }) as Record<string, { default: string }>;

    const png = import.meta.glob('./files/*', {
        query: {
            w: '400;700;900;1200',
            format: 'png',
            as: 'srcset',
        },
        eager: true,
    }) as Record<string, { default: string }>;

    const original = import.meta.glob('./files/*', {
        eager: true,
    }) as Record<string, { default: string }>;

    try {
        return {
            webp: webp[`./files/${path}`].default,
            png: png[`./files/${path}`].default,
            original: original[`./files/${path}`].default,
        };
    } catch (error) {
        Sentry.captureException(error);
        return {
            webp: '',
            png: '',
            original: '',
        };
    }
};
