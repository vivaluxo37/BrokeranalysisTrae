import classNames from 'classnames';
import React, { FC, PropsWithChildren, useCallback } from 'react';
import { Spinner } from '../../../core/elements/Spinner';
import { useHumanEyeEffectOnRef } from '../../../core/hooks/useHumanEyeEffect';

type ButtonSubtextPositionType = 'bottom' | 'left' | 'right';
type ButtonSizeType = 'large' | 'medium' | 'small' | 'extraSmall';
type ButtonVariantType =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'slate'
    | 'borderless-text-button'
    | 'danger';

const ButtonWrapper: FC<
    PropsWithChildren<{
        subText?: string;
        className?: string;
        subTextPosition?: ButtonSubtextPositionType;
    }>
> = ({ subText, children, className, subTextPosition }) => {
    if (!subText) {
        return children;
    }
    return (
        <div
            className={classNames(
                'relative flex w-max items-center',
                className,
                {
                    'flex-col': subTextPosition === 'bottom',
                    'flex-row-reverse': subTextPosition === 'left',
                    'flex-row': subTextPosition === 'right',
                },
            )}
        >
            {children}
        </div>
    );
};

export const Button: FC<{
    children?: React.ReactNode;
    IconRight?: React.ComponentType<React.ComponentProps<any>>;
    IconLeft?: React.ComponentType<React.ComponentProps<any>>;
    href?: string;
    newTab?: boolean;
    rel?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    className?: string;
    size?: ButtonSizeType;
    variant?: ButtonVariantType;
    /**
     * Content of the button. Can be overridden by React.children
     */
    text?: string;
    disabled?: boolean;
    onElementVisibleAsHumanEye?: () => void;
    type?: 'submit' | 'reset' | 'button';
    isLoading?: boolean;
    testId?: string;

    subText?: string;
    subTextPosition?: ButtonSubtextPositionType;
    subTextPositionClassName?: string;
    rootClassName?: string;
}> = (inputProps) => {
    const {
        onElementVisibleAsHumanEye,
        size = 'medium',
        variant,
        rel,
        IconLeft,
        IconRight,
        href,
        children,
        text,
        newTab,
        isLoading,
        testId,
        subText,
        subTextPosition = 'bottom',
        subTextPositionClassName,
        rootClassName,
        disabled: disabledFromProps,
        className: classNameFromInputProps,
        onClick,
        type,
    } = inputProps;

    const disabled = disabledFromProps || isLoading;

    const ref = useHumanEyeEffectOnRef(onElementVisibleAsHumanEye);

    const className = classNames(
        // common,
        'flex flex-row items-center justify-center',
        'font-medium text-sm uppercase tracking-wider',
        'cursor-pointer select-none',
        'rounded-lg box-border whitespace-nowrap',
        'transition-colors duration-100',
        'bc-link-no-decor',

        // variant
        {
            // text size
            'text-sm sm:text-base': size === 'large',
            'text-sm': size === 'medium',
            'text-xs sm:text-sm': size === 'small',
            'text-xs': size === 'extraSmall',

            // height
            'h-10 sm:h-12': size === 'large',
            'h-8 sm:h-10': size === 'medium',
            'h-6 sm:h-8': size === 'small',
            'h-6': size === 'extraSmall',

            // paddings
            // in tailwind box-sizing only works with fixed width & height, Tertiary button border should be calculated to the width...
            'px-[18px] sm:px-[26px]': size === 'large',
            'px-[16px] sm:px-[24px]':
                size === 'large' && variant === 'tertiary',

            'px-[13px] sm:px-[18px]': size === 'medium',
            'px-[11px] sm:px-[16px]':
                size === 'medium' && variant === 'tertiary',

            'px-[9px] sm:px-[13px]': size === 'small',
            'px-[7px] sm:px-[11px]': size === 'small' && variant === 'tertiary',

            'px-[9px]': size === 'extraSmall',
            'px-[7px]': size === 'extraSmall' && variant === 'tertiary',

            // colors
            'text-slate-950 bg-primary-500 hover:bg-primary-400 active:outline active:outline-2 active:outline-primary-200':
                variant === 'primary',
            'text-white bg-secondary-500 hover:bg-secondary-600 active:outline active:outline-2 active:outline-secondary-200':
                variant === 'secondary',
            'text-secondary-500 bg-white outline outline-2 outline-secondary-500 hover:bg-secondary-500 hover:text-white active:outline-secondary-200':
                variant === 'tertiary',
            'text-slate-500 bg-white border-2 border-slate-400':
                variant === 'slate',
            'bg-inherit text-secondary-500 shadow-transparent hover:shadow-transparent hover:bg-secondary-500 hover:bg-opacity-5 active:bg-opacity-10':
                variant === 'borderless-text-button',
            'text-white bg-danger-500 hover:bg-danger-600 active:outline active:outline-2 active:outline-danger-200':
                variant === 'danger',
        },
        classNameFromInputProps,
        disabled &&
            'bg-opacity-50 border-opacity-10 hover:border-opacity-20 hover:bg-opacity-60 hover:cursor-default',
    );

    const iconSizeClasses = {
        'stroke-2': true,
        'w-5 h-5': size === 'large',
        'w-4 h-4': size === 'medium',
        'w-3 h-3': size === 'small' || size === 'extraSmall',
    };

    const handleClick: React.MouseEventHandler<HTMLElement> = useCallback(
        (event) => {
            if (disabled) {
                return;
            }

            onClick?.(event);
        },
        [onClick, disabled],
    );

    const commonProps: React.ComponentProps<'a'> &
        React.ComponentProps<'button'> = {
        className,
        onClick: handleClick,
        onAuxClick: handleClick,
        disabled,
        children: (
            <>
                {IconLeft && (
                    <IconLeft
                        className={classNames(text && 'me-2', iconSizeClasses)}
                    />
                )}

                {children || text}

                {IconRight && (
                    <IconRight
                        className={classNames(text && 'ms-2', iconSizeClasses)}
                    />
                )}

                {isLoading && <Spinner className="ms-2" size="small" />}
            </>
        ),
    };

    const linkProps: React.ComponentProps<'a'> = {
        ...commonProps,
        ref,
        rel,
        target: newTab ? '_blank' : '',
        href,
    };

    const buttonProps: React.ComponentProps<'button'> = {
        ...commonProps,
        type: type || 'button',
    };

    return (
        <ButtonWrapper
            subText={subText}
            className={rootClassName}
            subTextPosition={subTextPosition}
        >
            {href ? (
                // children is defined, eslint is dumb
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a data-testid={testId} {...linkProps} />
            ) : (
                // it has a type, but eslint is too dumb
                // eslint-disable-next-line react/button-has-type
                <button data-testid={testId} {...buttonProps} />
            )}
            {subText && (
                <p
                    className={classNames(
                        'custom-html-disabled max-w-xs text-center text-2xs sm:text-xs',
                        subTextPositionClassName,
                        {
                            'mt-3 sm:mt-4': subTextPosition === 'bottom',
                            'me-3 sm:me-4': subTextPosition === 'left',
                            'ms-3 sm:ms-4': subTextPosition === 'right',
                        },
                    )}
                >
                    {subText}
                </p>
            )}
        </ButtonWrapper>
    );
};
