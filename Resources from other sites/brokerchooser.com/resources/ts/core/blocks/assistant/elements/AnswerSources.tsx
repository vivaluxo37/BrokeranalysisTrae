import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCollapsibleAnswerSources } from '../hooks/useCollapsibleAnswerSources';
import { AnswerSource } from '../types/AnswerSource';

export const AnswerSources: React.FC<{
    sources: AnswerSource[];
    messageId: number;
}> = ({ sources, messageId }) => {
    const { t } = useTranslation();

    const {
        shouldDisplayShowMoreButton,
        isCollapsed,
        sourcesToDisplay,
        handleSourceItemClick,
        handleCollapseButtonClick,
    } = useCollapsibleAnswerSources(sources, messageId);

    return (
        <div className="me-3 flex w-full flex-col gap-y-2 p-1 transition-colors">
            <div className="text-xs text-slate-500">
                {t('Explore related reads at BrokerChooser')}
            </div>
            <div className="flex flex-col items-center gap-2 lg:items-start">
                <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3">
                    {sourcesToDisplay.map(({ url, title }) => (
                        <ButtonOrLink
                            text=""
                            variant="tertiary"
                            key={title}
                            href={url}
                            onClick={() => handleSourceItemClick(url)}
                            target="_blank"
                            className="!p-0"
                            bodyClassName="!px-0 h-full w-full"
                        >
                            <div className="flex h-full w-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-0 text-xs text-slate-600 hover:bg-white hover:drop-shadow-lg">
                                <p className="p-3 pb-1 text-start font-normal">
                                    {title}
                                </p>
                                <div className="flex justify-end p-2">
                                    <span className="pe-1 text-xs font-semibold">
                                        {t('Read')}
                                    </span>
                                    <ArrowRightIcon className="size-4 rtl:scale-x-[-1]" />
                                </div>
                            </div>
                        </ButtonOrLink>
                    ))}
                </div>
                {shouldDisplayShowMoreButton && (
                    <div className="flex w-full justify-center">
                        <ButtonOrLink
                            text={isCollapsed ? t('List more') : t('List less')}
                            variant="tertiary"
                            size="xs"
                            bodyClassName="!px-2"
                            className={classNames(
                                'w-max shrink-0',
                                isCollapsed ? 'self-center' : 'lg:self-end',
                            )}
                            IconRight={ChevronDownIcon}
                            iconClassName={classNames(
                                'inline-block size-4 transition-transform duration-300',
                                {
                                    '-rotate-180': !isCollapsed,
                                },
                            )}
                            onClick={handleCollapseButtonClick}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
