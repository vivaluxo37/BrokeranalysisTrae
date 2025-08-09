import React, { FC } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CloseIcon } from './elements/CloseIcon';

export const ToastContainerWrapper: FC = () => (
    <ToastContainer
        theme="colored"
        autoClose={6000}
        position="bottom-right"
        toastStyle={{
            backgroundColor: '#0f172a',
            flex: 'auto',
            padding: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            lineHeight: '1.5',
            color: 'white',
        }}
        limit={3}
        closeButton={CloseIcon}
    />
);
