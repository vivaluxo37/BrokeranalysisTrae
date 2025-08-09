import { ScoreColors } from '../../brokerReviewPage/types/types';

export const getScoreColorClasses = (score: number): ScoreColors => {
    if (!score) {
        return {
            textClass: '',
            borderClass: '',
            thermometerClass: '',
        };
    }
    if (score * 20 <= 40) {
        return {
            textClass: 'text-danger-500',
            borderClass: 'border-danger-500',
            thermometerClass: 'bg-danger-500',
        };
    }
    if (score * 20 <= 72) {
        return {
            textClass: 'text-yellow-600',
            borderClass: 'border-yellow-600',
            thermometerClass: 'bg-yellow-500',
        };
    }

    return {
        textClass: 'text-success-600',
        borderClass: 'border-success-600',
        thermometerClass: 'bg-success-600',
    };
};
