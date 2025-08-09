import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { Card } from '@design-system/components/surfaces/card/Card';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MarkdownText } from '../../../elements/MarkdownText';
import { AnswerSource } from '../../assistant/types/AnswerSource';
import { ASSISTANT_SEARCH_RESULTS_MEASUREMENT_LIST_ID } from '../consts/measurementIds';

export const HighlightedSearchResultCard: FC<{
    result: AnswerSource;
}> = ({ result: { title, url, description } }) => {
    const { t } = useTranslation();
    return (
        <Card key={title} className="flex w-full flex-col gap-y-4">
            <span className="text-xl font-semibold">{title}</span>
            <MarkdownText content={description} />
            <TrackedButtonOrLink
                href={url}
                target="_blank"
                className="mt-auto w-max"
                variant="stroke"
                text={t('More info')}
                IconRight={ArrowRightIcon}
                size="sm"
                iconClassName="size-5"
                measurementListId={ASSISTANT_SEARCH_RESULTS_MEASUREMENT_LIST_ID}
                elementId="highlighted search result more info button"
                context={url}
            />
        </Card>
    );
};
