import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { Column } from '@design-system/components/layout/twoColumn/Column';
import { TwoColumn } from '@design-system/components/layout/twoColumn/TwoColumn';
import { useAnimationOnViewportEnter } from '@design-system/hooks/useAnimationOnViewportEnter';
import { ColorMode } from '@design-system/types/coreTypes';
import classNames from 'classnames';
import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getOptimisedImages } from '../../assets/getOptimisedImages';
import { Image } from '../../elements/Image';
import facebookIcon from './assets/facebook.svg';
import facebookIconWhite from './assets/facebook_white.svg';
import linkedInIcon from './assets/linkedin.svg';
import linkedInIconWhite from './assets/linkedin_white.svg';
import xIcon from './assets/x.svg';
import xIconWhite from './assets/x_white.svg';

const forumSectionImage = getOptimisedImages('forum-section.png');

export const ForumSection: FC<{
    mode?: ColorMode;
    withAnimation?: boolean;
}> = ({ mode = 'light', withAnimation = true }) => {
    const { t } = useTranslation();

    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleAnimationClass = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
        disabled: !withAnimation,
    });

    const textRef = useRef<HTMLParagraphElement>(null);
    const textAnimationClass = useAnimationOnViewportEnter({
        element: textRef,
        animationClassName: 'animate-fade-in-move-up',
        disabled: !withAnimation,
    });

    const buttonRef = useRef<HTMLDivElement>(null);
    const buttonAnimationClass = useAnimationOnViewportEnter({
        element: buttonRef,
        animationClassName: 'animate-fade-in-move-up',
        disabled: !withAnimation,
    });

    const socialButtonRef = useRef<HTMLDivElement>(null);
    const socialButtonAnimationClass = useAnimationOnViewportEnter({
        element: socialButtonRef,
        animationClassName: 'animate-fade-in-move-up',
        disabled: !withAnimation,
    });

    return (
        <SectionWrapper
            outerClassName={classNames(
                mode === 'dark' ? 'bg-slate-900' : 'bg-white',
            )}
        >
            <TwoColumn>
                <Column className="flex flex-col justify-center">
                    <div className="mb-0 mt-20 md:mb-20">
                        <h2
                            ref={titleRef}
                            className={classNames(
                                'title-1 font-medium',
                                mode === 'dark'
                                    ? 'text-white'
                                    : 'text-slate-800',
                                titleAnimationClass,
                            )}
                        >
                            {t('Join the discussions')}
                        </h2>
                        <p
                            ref={textRef}
                            className={classNames(
                                'pb-8 pt-6 text-xl',
                                mode === 'dark'
                                    ? 'text-white'
                                    : 'text-slate-800',
                                textAnimationClass,
                            )}
                        >
                            {t(
                                'Discover what your fellow investors and traders say',
                            )}
                        </p>
                        <div
                            ref={buttonRef}
                            className={classNames(buttonAnimationClass)}
                        >
                            <TrackedButtonOrLink
                                withRightArrow
                                variant="underlined-secondary"
                                mode={mode}
                                size="lg"
                                bodyClassName="ps-0"
                                href="https://community.brokerchooser.com/"
                                text={t('BrokerChooser Forum')}
                                measurementListId="tools section card"
                                elementId="bc community"
                            />
                        </div>

                        <div
                            ref={socialButtonRef}
                            className={classNames(
                                'flex gap-1 pt-10 md:pt-16',
                                socialButtonAnimationClass,
                            )}
                        >
                            <TrackedButtonOrLink
                                text="LinkedIn"
                                variant="tertiary"
                                mode={mode}
                                className="!px-0 !py-0"
                                bodyClassName="!px-0"
                                target="_blank"
                                href="https://www.linkedin.com/company/10527960/"
                                measurementListId="forum section social links"
                                elementId="linkedin"
                            >
                                <Image
                                    loading="lazy"
                                    imageSrc={
                                        mode === 'dark'
                                            ? linkedInIconWhite
                                            : linkedInIcon
                                    }
                                    alt="linkedin"
                                    className="h-12 w-12 max-w-12"
                                />
                            </TrackedButtonOrLink>
                            <TrackedButtonOrLink
                                text="Twitter"
                                variant="tertiary"
                                mode={mode}
                                className="!px-0 !py-0"
                                bodyClassName="!px-0"
                                target="_blank"
                                href="https://twitter.com/brokerchooser"
                                measurementListId="forum section social links"
                                elementId="x"
                            >
                                <Image
                                    loading="lazy"
                                    imageSrc={
                                        mode === 'dark' ? xIconWhite : xIcon
                                    }
                                    alt="x"
                                    className="h-12 w-12 max-w-12"
                                />
                            </TrackedButtonOrLink>
                            <TrackedButtonOrLink
                                text="Facebook"
                                variant="tertiary"
                                mode={mode}
                                className="!px-0 !py-0"
                                bodyClassName="!px-0"
                                target="_blank"
                                href="https://www.facebook.com/brokerchooser"
                                measurementListId="forum section social links"
                                elementId="facebook"
                            >
                                <Image
                                    loading="lazy"
                                    imageSrc={
                                        mode === 'dark'
                                            ? facebookIconWhite
                                            : facebookIcon
                                    }
                                    alt="facebook"
                                    className="h-12 w-12 max-w-12"
                                />
                            </TrackedButtonOrLink>
                        </div>
                    </div>
                </Column>
                <Column className="flex flex-col justify-end">
                    <Image
                        loading="lazy"
                        imageSrc={forumSectionImage}
                        alt="Forum section"
                        className="mt-0 lg:mt-20"
                    />
                </Column>
            </TwoColumn>
        </SectionWrapper>
    );
};
