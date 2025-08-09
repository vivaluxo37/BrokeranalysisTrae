import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SuggestedQuery } from '../types/SuggestedQuery';

export const useSuggestedQueries = () => {
    const { t } = useTranslation();

    const suggestedQueries = useMemo<SuggestedQuery[]>(
        () => [
            { text: t('What are the fees at IBKR?'), emoji: '💰' },
            {
                text: t('Does Lightyear pay interest on uninvested cash?'),
                emoji: '⚡',
            },
            { text: t('What is the best broker for beginners?'), emoji: '🚀' },
        ],
        [t],
    );

    const entryPointQueries = useMemo<SuggestedQuery[]>(
        () => [
            { text: t('What does ‘regulation’ mean?'), emoji: '🏛' },
            { text: t('How do I know if a broker is a scam?'), emoji: '⚠️' },
            { text: t('Which are the best online brokers?'), emoji: '🤩' },
        ],
        [t],
    );

    return { suggestedQueries, entryPointQueries };
};
