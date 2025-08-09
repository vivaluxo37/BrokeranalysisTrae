import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { Tooltip } from '@design-system/components/surfaces/tooltip/Tooltip';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAssistantInteractions } from '../hooks/useAssistantInteractions';
import { MinifyIcon } from './icons/MinifyIcon';

export const MinimizeAssistantButton: React.FC<{
    className?: string;
}> = ({ className }) => {
    const { onMinimize } = useAssistantInteractions();
    const { t } = useTranslation();

    return (
        <Tooltip
            content={t('Minimize chat')}
            trackingProps={{
                measurementListId: 'assistant close icon tooltip',
            }}
        >
            <ButtonOrLink
                text="Minimize"
                mode="light"
                variant="tertiary"
                className={classNames('bg-white !p-3.5', className)}
                bodyClassName="!p-0"
                onClick={onMinimize}
            >
                <MinifyIcon className="size-5 shrink-0 rtl:scale-x-[-1]" />
            </ButtonOrLink>
        </Tooltip>
    );
};
