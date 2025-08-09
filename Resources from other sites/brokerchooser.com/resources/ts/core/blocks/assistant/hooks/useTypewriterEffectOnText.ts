import { useEffect, useState } from 'react';

export const useTypewriterEffectOnText = ({
    text,
    animationOff = false,
    onAnimationFinished,
    delay = 10,
}: {
    text: string;
    animationOff?: boolean;
    onAnimationFinished?: () => void;
    delay?: number;
}) => {
    const [animatedText, setAnimatedText] = useState(animationOff ? text : '');

    const [isAnimationFinished, setIsAnimationFinished] =
        useState(animationOff);

    useEffect(() => {
        if (animationOff) {
            return () => {};
        }

        const chunks = text.split('');
        const timeoutsWithoutDelay = chunks.map((chunk, index) =>
            setTimeout(() => {
                setAnimatedText((prevState) => `${prevState}${chunk}`);
                if (index === chunks.length - 1) {
                    setIsAnimationFinished(true);
                    if (onAnimationFinished) {
                        onAnimationFinished();
                    }
                }
            }, index * delay),
        );

        return () => {
            timeoutsWithoutDelay.forEach((timeout) => clearTimeout(timeout));
        };
    }, [animationOff, delay, onAnimationFinished, text]);

    return {
        animatedText,
        isAnimationFinished,
    };
};
