import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { Column } from '@design-system/components/layout/twoColumn/Column';
import { TwoColumn } from '@design-system/components/layout/twoColumn/TwoColumn';
import { Badge } from '@design-system/components/miscellaneous/badge/Badge';
import { BlurryAccent } from '@design-system/components/miscellaneous/blurryAccent/BlurryAccent';
import { useAnimationOnViewportEnter } from '@design-system/hooks/useAnimationOnViewportEnter';
import classNames from 'classnames';
import React, { FC, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getOptimisedImages } from '../../assets/getOptimisedImages';
import { Image } from '../../elements/Image';
import { useAssistantInteractions } from '../assistant/hooks/useAssistantInteractions';
import { PingingDotIcon } from './elements/PingingDotIcon';

const askNuriMobileImage = getOptimisedImages('ask-nuri-plus-mobile-logo.png');

export const AskNuri: FC<{ withAnimation?: boolean }> = ({
    withAnimation = true,
}) => {
    const { t } = useTranslation();
    const { onOpen } = useAssistantInteractions();

    const badgeRef = useRef<HTMLDivElement>(null);
    const badgeAnimatedClassName = useAnimationOnViewportEnter({
        element: badgeRef,
        animationClassName: 'animate-fade-in-move-up',
        disabled: !withAnimation,
    });

    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleAnimatedClassName = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
        disabled: !withAnimation,
    });

    const bodyRef = useRef<HTMLSpanElement>(null);
    const bodyAnimationClassName = useAnimationOnViewportEnter({
        element: bodyRef,
        animationClassName: 'animate-fade-in-move-up',
        disabled: !withAnimation,
    });

    // Ref points to wrapping a div element, because tracked buttons currently do not support forwarding refs
    const buttonRef = useRef<HTMLDivElement>(null);
    const buttonAnimationClassName = useAnimationOnViewportEnter({
        element: bodyRef,
        animationClassName: 'animate-fade-in-move-up',
        disabled: !withAnimation,
    });

    return (
        <SectionWrapper outerClassName="bg-slate-950">
            <TwoColumn gap={0} className="!gap-8 py-20 lg:!gap-16">
                <Column className="flex shrink-0 flex-col justify-center gap-y-3">
                    <Badge
                        ref={badgeRef}
                        text="BETA"
                        size="lg"
                        variant="stroke"
                        mode="dark"
                        className={classNames('w-fit', badgeAnimatedClassName)}
                    />
                    <h2
                        ref={titleRef}
                        className={classNames(
                            'title-2 font-medium text-white',
                            titleAnimatedClassName,
                        )}
                    >
                        {/* prettier-ignore */}
                        <Trans i18nKey='Get instant <1>answers 24/7</1><2/>– Powered by AI'>
                            Get instant <span className="text-primary-500">answers 24/7</span><br />– Powered by AI
                        </Trans>
                    </h2>
                    <span
                        ref={bodyRef}
                        className={classNames(
                            'text-lg leading-7 text-white',
                            bodyAnimationClassName,
                        )}
                    >
                        {t(
                            'Meet Nuri AI – your 24/7 investing assistant for broker recommendations, finance answers, and smarter investment decisions.',
                        )}
                    </span>
                    <div ref={buttonRef} className={buttonAnimationClassName}>
                        <TrackedButtonOrLink
                            text={t('Ask Nuri AI now')}
                            onClick={() => onOpen()}
                            variant="secondary"
                            IconLeft={PingingDotIcon}
                            measurementListId="assistant promo section"
                            elementId="animated button"
                        />
                    </div>
                </Column>
                <Column className="flex items-center justify-center">
                    <BlurryAccent className="right-1/2 top-[33%] size-[70%] -translate-y-1/2 translate-x-1/2 bg-secondary-500/50" />
                    <Image
                        loading="lazy"
                        className="z-20 h-96 w-80"
                        imageSrc={askNuriMobileImage}
                        alt="Ask Nuri"
                    />
                </Column>
            </TwoColumn>
        </SectionWrapper>
    );
};
