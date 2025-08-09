import { Badge } from '@design-system/components/miscellaneous/badge/Badge';
import classNames from 'classnames';
import React, { FC } from 'react';
import { Image } from '../../../elements/Image';
import { useUserHandling } from '../../navbar/hooks/useUserHandling';
import NuriSquareIcon from '../assets/nuri-square-icon.svg';
import { SparklesIconColored } from './icons/SparklesIconColored';

export const AssistantName: FC<{
    className?: string;
}> = ({ className }) => {
    const { user } = useUserHandling();

    return (
        <div className={classNames('flex items-center gap-x-2', className)}>
            {user ? (
                <div className="flex size-10 rounded-lg bg-slate-100">
                    <SparklesIconColored className="m-auto size-6" />
                </div>
            ) : (
                <Image
                    loading="eager"
                    imageSrc={NuriSquareIcon}
                    alt="nuri"
                    className="m-[6px] size-[39px] shrink-0 overflow-clip rounded"
                />
            )}
            <div>
                <div className="flex items-center gap-x-1">
                    <div className="text-nowrap text-2xl font-medium leading-6">
                        Nuri AI
                        {user && ' Plus'}
                    </div>
                    <Badge
                        text="BETA"
                        className="align-center h-max rounded-full border border-slate-200 bg-transparent !py-0 text-black"
                    />
                </div>
            </div>
        </div>
    );
};
