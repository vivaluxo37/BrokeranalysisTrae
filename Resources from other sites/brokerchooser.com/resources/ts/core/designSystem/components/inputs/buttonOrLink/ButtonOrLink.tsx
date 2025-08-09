import { ButtonBody } from '@design-system/components/inputs/buttonOrLink/elements/ButtonBody';
import { ButtonWrapper } from '@design-system/components/inputs/buttonOrLink/elements/ButtonWrapper';
import classNames from 'classnames';
import React, { forwardRef, MutableRefObject } from 'react';
import { ButtonOrLinkProps } from './types';

export const ButtonOrLink = forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    ButtonOrLinkProps
>(
    (
        {
            children,
            text,
            active,
            variant = 'primary',
            size = 'md',
            mode = 'light',
            className,
            withLeftArrow,
            withRightArrow,
            IconRight,
            IconLeft,
            iconClassName,
            href,
            type,
            disabled,
            subText,
            bodyClassName,
            wrapperClassName,
            elementType,
            ...props
        },
        ref,
    ) => {
        const commonProps: Omit<ButtonOrLinkProps, 'text'> = {
            'aria-label': text,
            className: classNames(
                'inline-flex items-center justify-center rounded-lg outline outline-[2px] outline-transparent transition-colors duration-400 font-semibold bc-link-no-decor',
                disabled ? 'cursor-default' : 'cursor-pointer',
                {
                    'pointer-events-none': disabled,
                    'p-2': size === 'xs',
                    'py-2': size === 'sm',
                    'px-2.5':
                        size === 'sm' &&
                        variant !== 'underlined-primary' &&
                        variant !== 'underlined-secondary',
                    'py-3': size === 'md',
                    'px-3.5':
                        size === 'md' &&
                        variant !== 'underlined-primary' &&
                        variant !== 'underlined-secondary',
                    'py-4': size === 'lg',
                    'px-[18px]':
                        size === 'lg' &&
                        variant !== 'underlined-primary' &&
                        variant !== 'underlined-secondary',
                    'text-xs': size === 'xs',
                    'text-base': size === 'sm' || size === 'md',
                    'text-xl': size === 'lg',
                    'text-slate-950 bg-primary-500 hover:bg-primary-400 active:bg-primary-400 active:outline-primary-200 focus:outline-primary-200':
                        variant === 'primary' && !disabled,
                    '!bg-primary-400 !outline-primary-200':
                        variant === 'primary' && !disabled && active,
                    'text-white bg-blue-500 hover:bg-blue-400 active:bg-blue-400 active:outline-blue-200 focus:outline-blue-200':
                        variant === 'secondary' && !disabled,
                    '!bg-blue-400 !outline-blue-200':
                        variant === 'secondary' && !disabled && active,
                    'text-slate-400 focus:outline-slate-200':
                        (variant === 'underlined-primary' ||
                            variant === 'underlined-secondary') &&
                        disabled,
                    'text-secondary-500 focus:outline-slate-200':
                        variant === 'underlined-secondary' &&
                        mode === 'light' &&
                        !disabled,
                    'text-primary-500 focus:outline-slate-200':
                        variant === 'underlined-secondary' &&
                        mode === 'dark' &&
                        !disabled,
                },
                mode === 'light'
                    ? {
                          'text-slate-400 bg-slate-200':
                              (variant === 'primary' ||
                                  variant === 'secondary') &&
                              disabled,
                          'bg-slate-950 hover:bg-slate-800 text-white active:outline-slate-600 focus:outline-slate-600':
                              variant === 'monochrome' && !disabled,
                          'bg-slate-200  text-slate-400':
                              variant === 'monochrome' && disabled,
                          'text-slate-950 border border-slate-500 hover:border-slate-100 hover:bg-slate-100 active:outline-slate-200 focus:outline-slate-200':
                              variant === 'stroke' && !disabled,
                          'text-slate-400 border border-slate-400':
                              variant === 'stroke' && disabled,
                          'text-slate-600 hover:bg-slate-100 active:bg-slate-100 active:outline-slate-200 focus:outline-slate-200':
                              variant === 'tertiary' && !disabled,
                          '!outline-slate-200':
                              (variant === 'stroke' ||
                                  variant === 'tertiary') &&
                              !disabled &&
                              active,
                          'text-slate-400':
                              (variant === 'tertiary' ||
                                  variant === 'destructive') &&
                              disabled,
                          'text-slate-950 focus:outline-slate-200':
                              variant === 'underlined-primary' && !disabled,
                          'bg-slate-100': variant === 'destructive' && disabled,
                          'text-danger-500 bg-slate-100 hover:bg-danger-100 active:bg-danger-100 active:outline-danger-200 focus:outline-danger-200':
                              variant === 'destructive' && !disabled,
                      }
                    : {
                          'text-slate-500 bg-slate-700':
                              (variant === 'primary' ||
                                  variant === 'secondary') &&
                              disabled,
                          'bg-white hover:bg-slate-200 text-slate-950 active:outline-white focus:outline-white':
                              variant === 'monochrome' && !disabled,
                          'bg-slate-700  text-slate-500':
                              variant === 'monochrome' && disabled,
                          'text-white border border-slate-500 hover:border-slate-700 hover:bg-slate-700 active:bg-slate-600 active:outline-slate-400 focus:outline-slate-400':
                              variant === 'stroke' && !disabled,
                          'text-slate-600 border border-slate-600':
                              variant === 'stroke' && disabled,
                          'text-white hover:bg-slate-700 active:bg-slate-600 active:outline-slate-400 focus:outline-slate-400':
                              variant === 'tertiary' && !disabled,
                          '!bg-slate-600 !outline-slate-400':
                              (variant === 'stroke' ||
                                  variant === 'tertiary') &&
                              !disabled &&
                              active,
                          'text-white':
                              variant === 'underlined-primary' && !disabled,
                          'text-slate-600 focus:outline-slate-200':
                              (variant === 'tertiary' ||
                                  variant === 'underlined-primary' ||
                                  variant === 'underlined-secondary' ||
                                  variant === 'destructive') &&
                              disabled,
                          'bg-slate-700': variant === 'destructive' && disabled,
                          'text-danger-500 bg-slate-700 hover:bg-danger-100 active:bg-danger-100 active:outline-danger-400 focus:outline-danger-400':
                              variant === 'destructive' && !disabled,
                      },
                className,
            ),
            disabled,
            ...props,
        };

        return (
            <ButtonWrapper
                variant={variant}
                mode={mode}
                subText={subText}
                disabled={disabled}
                className={wrapperClassName}
            >
                {React.createElement(
                    elementType ?? (href ? 'a' : 'button'),
                    {
                        ref: ref as MutableRefObject<
                            HTMLAnchorElement | HTMLButtonElement
                        >,
                        href,
                        type,
                        ...commonProps,
                    },
                    <ButtonBody
                        withLeftArrow={withLeftArrow}
                        IconLeft={IconLeft}
                        text={text}
                        withRightArrow={withRightArrow}
                        IconRight={IconRight}
                        iconClassName={iconClassName}
                        className={bodyClassName}
                    >
                        {children}
                    </ButtonBody>,
                )}
            </ButtonWrapper>
        );
    },
);

ButtonOrLink.displayName = 'ButtonOrLink';
