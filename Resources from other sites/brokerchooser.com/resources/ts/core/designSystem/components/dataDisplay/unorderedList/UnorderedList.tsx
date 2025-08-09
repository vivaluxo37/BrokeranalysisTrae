import { SizeVariant } from '@design-system/types/coreTypes';
import classNames from 'classnames';
import React, { ReactElement, forwardRef } from 'react';
import { ImageAsBackground } from '../../../../../components/tailwind/atom/ImageAsBackground';

export const UnorderedList = forwardRef<
    HTMLUListElement,
    {
        items: { id: number; text: ReactElement }[];
        className?: string;
        size?: SizeVariant;
        bulletImagePath?: string;
        columns?: 1 | 2;
    }
>(({ className, bulletImagePath, items, size, columns = 1 }, ref) => (
    <ul
        ref={ref}
        className={classNames('grid grid-cols-1 gap-2', className, {
            'sm:grid-cols-2': columns === 2,
            'ms-6 list-disc': !bulletImagePath,
        })}
    >
        {items.map(({ id, text }) => (
            <li
                key={id}
                className={classNames('font-normal text-slate-800', {
                    'gap-3': size === 'xl',
                    'gap-2': size === 'md',
                    'flex items-start': bulletImagePath,
                })}
            >
                {bulletImagePath && (
                    <ImageAsBackground
                        imageSrc={bulletImagePath}
                        className={classNames({
                            'mt-1.5 h-[18px] w-[18px]': size === 'xl',
                            'mt-1 h-4 w-4': size === 'md',
                        })}
                    />
                )}
                <div
                    className={classNames('flex-1', {
                        'text-base': size === 'md',
                        'text-xl': size === 'xl',
                    })}
                >
                    {text}
                </div>
            </li>
        ))}
    </ul>
));

UnorderedList.displayName = 'UnorderedList';
