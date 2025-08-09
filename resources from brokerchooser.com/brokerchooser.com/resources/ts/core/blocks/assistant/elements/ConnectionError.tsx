import { SignalSlashIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const ConnectionError: FC = () => {
    const { t } = useTranslation();

    return (
        <div className="relative -mt-4 h-0 w-full">
            <div className="absolute inset-x-0 bottom-0 z-30 mx-4 flex items-center gap-x-2 rounded-lg bg-danger-50 p-4 text-xs text-danger-500 lg:mx-0 lg:me-8">
                <ExclamationCircleIcon className="size-5 shrink-0 fill-danger-600" />
                {t(
                    'We are currently unable to connect to the server. Stay with us, we usually need just a few seconds to solve this problem.',
                )}
                <SignalSlashIcon className="ms-auto size-5 shrink-0 animate-pulse stroke-danger-600" />
            </div>
        </div>
    );
};
