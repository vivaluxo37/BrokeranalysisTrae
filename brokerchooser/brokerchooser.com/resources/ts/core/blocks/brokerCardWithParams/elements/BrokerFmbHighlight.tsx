import React, { FC } from 'react';
import { ImageAsBackground } from '../../../../components/tailwind/atom/ImageAsBackground';
import { BCTooltip } from '../../../elements/BCTooltip';
import { BrokerHighlight } from '../../../types/commonTypes';

export const BrokerFmbHighlight: FC<{
    brokerHighlight: BrokerHighlight;
}> = ({ brokerHighlight }) => (
    <div className="absolute top-0 flex self-center rounded-b bg-success-500 pb-0.5">
        <BCTooltip
            content={brokerHighlight.description || ''}
            contentClassName="text-black w-52"
            className="flex justify-center"
        >
            <div className="flex px-2 text-xs font-semibold text-white">
                <ImageAsBackground
                    imageSrc="/images/icons/white-check.svg"
                    className="me-1 h-3 w-3 self-center"
                />
                {brokerHighlight.label}
            </div>
        </BCTooltip>
    </div>
);
