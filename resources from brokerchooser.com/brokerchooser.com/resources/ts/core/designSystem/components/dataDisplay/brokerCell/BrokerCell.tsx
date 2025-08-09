import { Card } from '@design-system/components/surfaces/card/Card';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { VisitBrokerLink } from '../../../../../components/tailwind/molecules/VisitBrokerLink';
import { BrokerLogo } from '../../../../elements/BrokerLogo';
import { Broker } from '../../../../types/commonTypes';

export const BrokerCell = forwardRef<
    HTMLDivElement,
    {
        broker: Broker;
        measurementListId: string;
        index: number;
        className?: string;
        onClick?: () => void;
    }
>(({ broker, measurementListId, index, className, onClick }, ref) => (
    <VisitBrokerLink
        broker={broker}
        measurementListId={measurementListId}
        onClick={onClick}
        positionIndex={index + 1}
    >
        <Card
            ref={ref}
            clickable
            withShadow
            className={classNames(
                'group relative flex items-center',
                className,
            )}
        >
            <BrokerLogo broker={broker} />
            <div className="mx-3 flex-grow overflow-hidden lg:mx-6">
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-semibold lg:text-[22px]">
                    {index + 1}. {broker.name}
                </p>
                {broker.cfdWarning && (
                    <span className="relative -top-px block text-xs leading-3 text-slate-500 transition-all duration-500 group-hover:max-h-96 group-hover:opacity-100 md:max-h-0 md:opacity-0">
                        {broker.cfdWarning}
                    </span>
                )}
            </div>
            <div className="rounded-full border border-slate-600 p-2.5 shadow group-active:border-blue-500">
                <ArrowRightIcon className="h-5 w-5 -rotate-45 text-slate-600 group-active:text-blue-500" />
            </div>
        </Card>
    </VisitBrokerLink>
));

BrokerCell.displayName = 'BrokerCell';
