import { StarIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScoreColors } from '../../brokerReviewPage/types/types';
import { getScoreColorClasses } from '../functions/getScoreColorTextClass';

export const ScoreWithStarAndDecimal: FC<{
    score: number;
    scoreTextOverride?: string;
}> = ({ score, scoreTextOverride }) => {
    const { t } = useTranslation();
    const scoreColorClasses: ScoreColors = useMemo(
        () => getScoreColorClasses(score),
        [score],
    );
    return (
        <div className="flex flex-row items-center gap-1 text-xs font-medium text-slate-500 sm:text-sm">
            {scoreTextOverride ?? t('Score')}:
            <StarIcon
                className={classNames('h-4 w-4', scoreColorClasses.textClass)}
            />
            <span className="border-slate-950 text-slate-950">
                {score.toFixed(1)}
                <span className="font-light text-slate-500">/5</span>
            </span>
        </div>
    );
};
