import { AccordionItem } from '@design-system/components/surfaces/accordion/AccordionItem';
import { AccordionProps } from '@design-system/components/surfaces/accordion/types';
import classNames from 'classnames';
import React, { FC } from 'react';

export const Accordion: FC<AccordionProps> = ({
    accordionItems,
    onItemClick,
    measurementListId,
    className,
    size = 'lg',
    disabled,
    allOpenedInitially,
}) => (
    <div className={classNames('flex flex-col', className)}>
        {accordionItems.map(
            ({ id, title, content, leftIcon, iconClassName }) => (
                <AccordionItem
                    key={id}
                    title={title}
                    content={content}
                    id={id}
                    onClick={onItemClick}
                    measurementListId={measurementListId}
                    size={size}
                    disabled={disabled}
                    leftIcon={leftIcon}
                    initialOpen={allOpenedInitially}
                    iconClassName={iconClassName}
                />
            ),
        )}
    </div>
);
