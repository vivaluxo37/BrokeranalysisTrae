import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { FC } from 'react';
import { CloseButtonProps } from 'react-toastify';

export const CloseIcon: FC<CloseButtonProps> = ({ closeToast }) => (
    <button type="button" onClick={closeToast}>
        <XMarkIcon className="h-5 max-h-5 min-h-5 w-5 min-w-5 max-w-5 cursor-pointer text-white hover:text-slate-500" />
    </button>
);
