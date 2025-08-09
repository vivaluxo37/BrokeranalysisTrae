import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { SparklesIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from '../../../elements/Image';
import { DiscoverQuestion } from '../types/DiscoverQuestion';

export const DiscoverCard: React.FC<{
    discoverQuestion: DiscoverQuestion;
    onClick: () => void;
    className?: string;
}> = ({
    discoverQuestion: { question, imageUrl, emoji },
    onClick,
    className,
}) => {
    const { t } = useTranslation();

    return (
        <div
            className={classNames(
                className,
                'flex cursor-pointer flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-all duration-200 hover:border-slate-400 hover:shadow-lg',
            )}
            role="presentation"
            onClick={onClick}
        >
            {imageUrl ? (
                <Image
                    imageSrc={imageUrl}
                    alt={question}
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                />
            ) : (
                <div className="title-6 -mb-2">{emoji}</div>
            )}
            <div className="text-body">{question}</div>
            <div className="flex justify-end">
                <ButtonOrLink
                    mode="light"
                    size="xs"
                    variant="tertiary"
                    text={t('Ask Nuri')}
                    IconLeft={SparklesIcon}
                    iconClassName="size-4"
                />
            </div>
        </div>
    );
};
