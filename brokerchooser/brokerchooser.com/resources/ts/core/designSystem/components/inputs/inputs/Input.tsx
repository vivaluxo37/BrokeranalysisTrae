import {
    InputElementProps,
    InputProps,
    TextAreaProps,
} from '@design-system/components/inputs/inputs/types';
import classNames from 'classnames';
import React, { ForwardedRef, forwardRef } from 'react';

export const Input = forwardRef<
    HTMLInputElement | HTMLTextAreaElement,
    InputProps
>(
    (
        {
            className,
            mode = 'light',
            IconLeft,
            IconRight,
            label,
            name,
            description,
            errorDescription,
            isMultiLine = false,
            inputClassName,
            ...props
        },
        ref,
    ) => {
        const commonProps = {
            ...props,
            name,
            className: classNames(
                'flex-1 border-none bg-transparent px-0 text-base outline-none placeholder:text-slate-500 focus:outline-none focus:ring-0',
                {
                    'text-slate-950': mode === 'light',
                    'text-white': mode === 'dark',
                },
            ),
        };

        return (
            <div
                className={classNames(className, {
                    'flex flex-col gap-2':
                        !!label || !!errorDescription || !!description,
                })}
            >
                {label && (
                    <label htmlFor={name} className="text-xs text-slate-500">
                        {label}
                    </label>
                )}
                <div
                    className={classNames(
                        inputClassName,
                        'flex items-center gap-2 rounded-lg border px-3.5 py-1',
                        {
                            'border-slate-200 focus-within:border-blue-500 active:border-blue-500 [&:hover:not(:focus-within)]:border-slate-400':
                                mode === 'light',
                            'border-slate-600 focus-within:border-blue-500 active:border-blue-500 [&:hover:not(:focus-within)]:border-slate-400':
                                mode === 'dark',
                        },
                    )}
                >
                    {IconLeft && (
                        <IconLeft
                            className={classNames('h-5 w-5', {
                                'text-slate-400': mode === 'light',
                                'text-slate-600': mode === 'dark',
                            })}
                        />
                    )}
                    {isMultiLine ? (
                        <textarea
                            ref={ref as ForwardedRef<HTMLTextAreaElement>}
                            {...(commonProps as TextAreaProps)}
                        />
                    ) : (
                        <input
                            ref={ref as ForwardedRef<HTMLInputElement>}
                            {...(commonProps as InputElementProps)}
                        />
                    )}
                    {IconRight && (
                        <IconRight
                            className={classNames('h-5 w-5', {
                                'text-slate-400': mode === 'light',
                                'text-slate-600': mode === 'dark',
                            })}
                        />
                    )}
                </div>
                {(description || errorDescription) && (
                    <div
                        className={classNames('flex', {
                            'justify-between':
                                !!description && !!errorDescription,
                            'justify-end': !description && !!errorDescription,
                        })}
                    >
                        {description && (
                            <p className="text-xs text-slate-400">
                                {description}
                            </p>
                        )}
                        {errorDescription && (
                            <p className="text-xs text-danger-500">
                                {errorDescription}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';
