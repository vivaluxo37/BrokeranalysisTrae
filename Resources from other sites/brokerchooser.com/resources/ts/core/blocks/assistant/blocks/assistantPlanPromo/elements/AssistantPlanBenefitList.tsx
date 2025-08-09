import { CheckIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import React, { FC } from 'react';

export const AssistantPlanBenefitList: FC<{
    className?: string;
    list: string[];
}> = ({ className, list }) => (
    <div className={classNames('flex flex-col gap-2', className)}>
        {list.map((text) => (
            <div
                key={text}
                className="flex items-center gap-2 text-base font-normal text-slate-950 md:text-lg"
            >
                <CheckIcon className="size-6" />
                {text}
            </div>
        ))}
    </div>
);
