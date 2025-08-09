import React from 'react';
import { Spinner } from './Spinner';

export const LoadingOverlay = function LoadingOverlay() {
    return (
        <div
            className="relative z-50 flex h-full w-full items-center justify-center"
            style={{ background: '#00000099' }}
        >
            <Spinner size="large" />
        </div>
    );
};
