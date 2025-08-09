import classNames from 'classnames';
import React, { FC } from 'react';
import { Image } from '../../../elements/Image';

export const NavBarLogo: FC<{
    mode?: string;
    internalNotification?: string;
    eventHandler: (label: string) => void;
    className?: string;
}> = ({ mode = 'dark', eventHandler, internalNotification, className }) => (
    <a
        href="/"
        onClick={() => {
            eventHandler('https://brokerchooser.com/');
        }}
    >
        <Image
            alt="BrokerChooser logo"
            imageSrc={
                mode === 'dark'
                    ? '/images/logo.svg'
                    : '/images/brokerchooser-logo.svg'
            }
            className={classNames('ms-4 mt-1 h-12 max-w-56', className)}
        />
        {internalNotification && (
            <div className="absolute top-0 text-danger-500">
                {internalNotification}
            </div>
        )}
    </a>
);
