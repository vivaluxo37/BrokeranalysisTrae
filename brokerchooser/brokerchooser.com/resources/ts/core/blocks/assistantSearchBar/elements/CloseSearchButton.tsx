import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AssistantSearchBarProps } from '../types/AssistantSearchBarProps';

export const CloseSearchButton: FC<{
    onClose: AssistantSearchBarProps['onClose'];
}> = ({ onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="flex w-full justify-end bg-white px-4 pt-4 md:block md:pt-0">
            <ButtonOrLink
                text={t('Close')}
                className="right-6 top-6 md:fixed"
                variant="tertiary"
                iconClassName="size-5"
                IconRight={XMarkIcon}
                onClick={onClose}
            />
        </div>
    );
};
