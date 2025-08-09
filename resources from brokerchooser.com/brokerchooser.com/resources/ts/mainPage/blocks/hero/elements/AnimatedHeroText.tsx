/* eslint-disable react/jsx-no-useless-fragment */
import { useAnimationOnViewportEnter } from '@design-system/hooks/useAnimationOnViewportEnter';
import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const AnimatedHeroText = () => {
    const { t } = useTranslation();

    const variableTexts = useMemo(
        () => [t('top'), t('regulated'), t('tested'), t('trusted')],
        [t],
    );

    const variableText1ComponentRef = useRef<HTMLSpanElement>(null);
    const variableText2ComponentRef = useRef<HTMLSpanElement>(null);

    const [textIndex, setTextIndex] = useState(0);
    useEffect(() => {
        const timeInterval = setInterval(() => {
            if (
                variableText1ComponentRef.current === null ||
                variableText2ComponentRef.current === null
            ) {
                return;
            }
            variableText1ComponentRef.current.classList.remove('opacity-100');
            variableText1ComponentRef.current.classList.add('opacity-0');
            variableText2ComponentRef.current.classList.remove('opacity-100');
            variableText2ComponentRef.current.classList.add('opacity-0');
            setTimeout(() => {
                if (
                    variableText1ComponentRef.current === null ||
                    variableText2ComponentRef.current === null
                ) {
                    return;
                }
                setTextIndex((prevIndex) =>
                    prevIndex === variableTexts.length - 1 ? 0 : prevIndex + 1,
                );
                variableText1ComponentRef.current.classList.remove('opacity-0');
                variableText1ComponentRef.current.classList.add('opacity-100');
                variableText2ComponentRef.current.classList.remove('opacity-0');
                variableText2ComponentRef.current.classList.add('opacity-100');
            }, 150);
        }, 3000);
        return () => clearInterval(timeInterval);
    }, [variableTexts.length]);

    const titleRef = useRef<HTMLParagraphElement>(null);
    const titleAnimationClass = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const variable = variableTexts[textIndex];

    return (
        <h2
            ref={titleRef}
            className={classNames(
                'hero w-full text-center font-semibold text-slate-800 md:text-start',
                titleAnimationClass,
            )}
        >
            {/* prettier-ignore */}
            <Trans i18nKey="Get matched<br /><2>with </2><3>[variable]</3><br /> online brokers" values={{variable }}>
                Get matched
                <br/>
                <span ref={variableText1ComponentRef} className="transition duration-150 opacity-100 md:!opacity-100">
                    width{' '}
                </span>
                <span
                    ref={variableText2ComponentRef}
                    className="transition duration-150 opacity-100 text-primary-500"
                >
                    {variable}
                </span>
                <br/>
                {' '}
                online brokers
            </Trans>
        </h2>
    );
};
