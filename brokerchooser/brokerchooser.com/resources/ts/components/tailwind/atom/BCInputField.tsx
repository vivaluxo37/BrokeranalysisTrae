import classNames from 'classnames';
import React, { KeyboardEventHandler, useCallback } from 'react';
import { ImageAsBackground } from './ImageAsBackground';

type BCInputFieldSizeType = 'large' | 'medium' | 'small';

type BCInputFieldLabelType = {
    text: string;
    className?: string;
};

type BCInputFieldProps = {
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined;
    placeholder: string;
    hasError?: boolean;
    className?: string;
    inputClassName?: string;
    errorMessage?: string;
    size?: BCInputFieldSizeType;
    label?: BCInputFieldLabelType;
    search?: boolean;
    autocomplete?: boolean;
    testId?: string;
    disabled?: boolean;
};

export const BCInputField: React.FunctionComponent<BCInputFieldProps> =
    function BCInputField(props: BCInputFieldProps) {
        const {
            value,
            onChange,
            onKeyDown,
            placeholder,
            hasError,
            className,
            inputClassName,
            errorMessage,
            size = 'small',
            label,
            search,
            autocomplete,
            testId,
            disabled = false,
        } = props;

        const handleOnChange = useCallback(
            (event: any) => onChange(event.target.value),
            [onChange],
        );

        const labelClassName = label?.className ?? 'text-sm ms-2 mb-2 mt-6';

        return (
            <div className={className}>
                {label && <p className={labelClassName}>{label.text}</p>}

                <div className="relative">
                    {search && value.length > 0 && (
                        <span
                            className="absolute right-2 flex h-full cursor-pointer items-center"
                            onClick={() => onChange('')}
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter' ||
                                    event.key === 'Space'
                                ) {
                                    onChange('');
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label="Clear input"
                        >
                            <ImageAsBackground
                                imageSrc="/images/icons/close_icon.svg"
                                className="h-6 w-6"
                            />
                        </span>
                    )}
                    <input
                        type="text"
                        className={classNames(
                            'w-full rounded border py-1 ps-4 text-sm text-black placeholder-gray-400 outline-none sm:text-base',
                            hasError ? 'border-danger-500' : 'border-gray-300',
                            search ? 'pe-9' : 'pe-4',
                            disabled && 'bg-slate-100',
                            inputClassName,
                            {
                                'h-14': size === 'large',
                                'h-12': size === 'medium',
                                'h-10': size === 'small',
                            },
                        )}
                        name="input"
                        value={value}
                        onChange={handleOnChange}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        autoComplete={autocomplete ? 'on' : 'off'}
                        data-testid={testId}
                        disabled={disabled}
                    />
                </div>
                {hasError && (
                    <p className="absolute ms-4 mt-1.5 text-xs text-danger-500">
                        {errorMessage || 'Invalid field'}
                    </p>
                )}
            </div>
        );
    };
