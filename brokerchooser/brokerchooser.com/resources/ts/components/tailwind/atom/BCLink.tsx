import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

type BCLinkProps = PropsWithChildren<{
    className?: string;
    textClassName?: string;
    href?: string;
    onClick?: () => void;
    newTab?: boolean;
    /**
     * The text that is clickable. React.children overrides this
     */
    text?: string;
    withLeftIcon?: boolean;
    withRightIcon?: boolean;
    icon?: React.ReactElement;
    /**
     * Used to either inherit the text size or override with custom class
     */
    disableTextClassNames?: boolean;
    disableLinkClassNames?: boolean;
}>;

export const BCLink: FC<BCLinkProps> = ({
    href,
    onClick,
    newTab,
    className,
    children,
    disableLinkClassNames,
    withLeftIcon,
    withRightIcon,
    icon,
    textClassName,
    text,
    disableTextClassNames,
}) => {
    const clickHandlerProps: Pick<BCLinkProps, 'href' | 'onClick'> = {};

    if (href) {
        clickHandlerProps.href = href;
    }

    if (onClick) {
        clickHandlerProps.onClick = onClick;
    }

    return (
        <a
            {...clickHandlerProps}
            className={classNames(
                disableLinkClassNames
                    ? className
                    : [
                          'inline max-w-max cursor-pointer',
                          // text size should be inherited by default, needs to be refactored
                          !disableTextClassNames && 'text-sm sm:text-base',
                          'bc-link-hover-effect',
                          className,
                      ],
            )}
            target={newTab ? '_blank' : ''}
        >
            {withLeftIcon &&
                (icon || (
                    <ArrowLeftIcon className="mb-px me-2 inline h-4 w-4" />
                ))}

            <span className={textClassName}>{children || text}</span>

            {withRightIcon &&
                (icon || (
                    <ArrowRightIcon className="mb-px ms-2 inline h-4 w-4" />
                ))}
        </a>
    );
};
