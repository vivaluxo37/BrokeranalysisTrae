import { useAccordion } from '@design-system/components/surfaces/accordion/hooks/useAccordion';
import { AccordionItemProps } from '@design-system/components/surfaces/accordion/types';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { forwardRef } from 'react';

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
    (
        {
            id,
            title,
            content,
            onClick,
            measurementListId,
            className,
            size,
            disabled,
            leftIcon: LeftIcon,
            initialOpen,
            iconClassName,
        },
        ref,
    ) => {
        const { showContent, toggleItem } = useAccordion(
            id,
            onClick,
            measurementListId,
            initialOpen,
        );

        return (
            <div
                ref={ref}
                key={id}
                className={classNames(
                    'group border-slate-200',
                    {
                        'border-b': !disabled,
                    },
                    className,
                )}
            >
                <button
                    type="button"
                    className={classNames(
                        'flex w-full items-center justify-between gap-2 font-medium',
                        showContent && !disabled
                            ? 'text-blue-500'
                            : 'text-slate-800',
                        {
                            'py-4 text-xl': size === 'lg',
                            'py-2 text-base': size === 'md',
                            'group-hover:text-blue-500': !disabled,
                            'pointer-events-none cursor-default': disabled,
                            'pb-5': showContent,
                        },
                    )}
                    onClick={toggleItem}
                >
                    {LeftIcon && (
                        <LeftIcon
                            className={classNames(iconClassName, {
                                'size-5': size === 'lg',
                                'size-4': size === 'md',
                            })}
                        />
                    )}
                    <p className="flex-1 text-left">{title}</p>
                    <p
                        className={classNames(
                            'px-2',
                            {
                                hidden: disabled,
                            },
                            showContent && 'text-blue-500',
                        )}
                    >
                        {showContent ? (
                            <MinusIcon
                                className={classNames({
                                    'size-5': size === 'lg',
                                    'size-4': size === 'md',
                                })}
                            />
                        ) : (
                            <PlusIcon
                                className={classNames({
                                    'size-5': size === 'lg',
                                    'size-4': size === 'md',
                                })}
                            />
                        )}
                    </p>
                </button>
                <div
                    className={classNames({
                        hidden: !showContent,
                        'pb-4': !disabled,
                    })}
                >
                    {content}
                </div>
            </div>
        );
    },
);

AccordionItem.displayName = 'AccordionItem';
