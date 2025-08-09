import { ButtonVariant } from '@design-system/components/inputs/buttonOrLink/types';
import { ColorMode } from '@design-system/types/coreTypes';
import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export const ButtonWrapper: FC<
    PropsWithChildren<{
        mode: ColorMode;
        subText?: string;
        variant: ButtonVariant;
        className?: string;
        disabled?: boolean;
    }>
> = ({ children, subText, mode, variant, disabled, className }) => {
    if (
        !subText &&
        variant !== 'underlined-primary' &&
        variant !== 'underlined-secondary'
    ) {
        return children;
    }
    return (
        <div
            className={classNames(
                'group relative flex w-max flex-col items-center',
                {
                    'pointer-events-none': disabled,
                },
                className,
            )}
        >
            {children}
            {variant === 'underlined-primary' && (
                <div className="w-full">
                    <div className="end-0 start-0 h-px group-hover:animate-slide-in group-hover:bg-primary-500" />
                </div>
            )}
            {variant === 'underlined-secondary' && (
                <div className="w-full">
                    <div
                        className={classNames(
                            'end-0 start-0 h-px group-hover:animate-slide-in',
                            {
                                'group-hover:bg-primary-500': mode === 'dark',
                                'group-hover:bg-secondary-500':
                                    mode === 'light',
                            },
                        )}
                    />
                </div>
            )}
            {subText && (
                <p
                    className={classNames(
                        'custom-html-disabled',
                        'mx-auto max-w-xs pt-2 text-center text-xs font-normal',
                        {
                            'text-danger-500':
                                variant === 'destructive' && !disabled,
                        },
                        variant !== 'destructive' &&
                            !disabled &&
                            (mode === 'light'
                                ? {
                                      'text-slate-600': !disabled,
                                      'text-slate-400': disabled,
                                  }
                                : {
                                      'text-slate-400': !disabled,
                                      'text-slate-600': disabled,
                                  }),
                    )}
                >
                    {subText}
                </p>
            )}
        </div>
    );
};
