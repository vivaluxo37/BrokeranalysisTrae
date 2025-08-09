import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { Column } from '@design-system/components/layout/twoColumn/Column';
import { TwoColumn } from '@design-system/components/layout/twoColumn/TwoColumn';
import { BlurryAccent } from '@design-system/components/miscellaneous/blurryAccent/BlurryAccent';
import { useAnimationOnViewportEnter } from '@design-system/hooks/useAnimationOnViewportEnter';
import classNames from 'classnames';
import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getOptimisedImages } from '../../../core/assets/getOptimisedImages';
import { Image } from '../../../core/elements/Image';

const adamNasliProfileImage = getOptimisedImages('adam-nasli.png');
const gergoProfileImage = getOptimisedImages('gergely-korpos.png');
const hikmatProfileImage = getOptimisedImages('hikmatjon-tolibjonov.png');
const krisztianProfileImage = getOptimisedImages('krisztian-gatonyi.png');
const theresaProfileImage = getOptimisedImages('theresa.png');
const reachOutGroupImage = getOptimisedImages('reach-out-group.jpg');

export const ReachOutSection: FC = () => {
    const { t } = useTranslation();

    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleAnimationClass = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const textRef = useRef<HTMLParagraphElement>(null);
    const textAnimationClass = useAnimationOnViewportEnter({
        element: textRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const buttonRef = useRef<HTMLDivElement>(null);
    const buttonAnimationClass = useAnimationOnViewportEnter({
        element: buttonRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const button2Ref = useRef<HTMLDivElement>(null);
    const button2AnimationClass = useAnimationOnViewportEnter({
        element: button2Ref,
        animationClassName: 'animate-fade-in-move-up',
    });

    const expertImagesRef = useRef<HTMLDivElement>(null);
    const expertImagesAnimationClass = useAnimationOnViewportEnter({
        element: expertImagesRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    return (
        <SectionWrapper innerClassName="!max-w-[1512px]">
            <TwoColumn gap={5} className="md:flex-col lg:flex-row">
                <Column className="overflow-hidden bg-slate-900">
                    <BlurryAccent className="bottom-0 right-0 h-[60%] w-[80%] translate-x-1/2 translate-y-1/2 bg-secondary-600/35" />
                    <BlurryAccent className="bottom-[35%] right-0 h-[50%] w-[15%] translate-x-1/2 translate-y-1/2 bg-primary-500/25" />
                    <div className="flex flex-col justify-end gap-8 px-6 py-10 md:gap-10 md:p-20">
                        <div className="flex flex-col gap-8">
                            <h2
                                ref={titleRef}
                                className={classNames(
                                    'title-1 font-medium text-white',
                                    titleAnimationClass,
                                )}
                            >
                                {t('Reach out to us')}
                            </h2>
                            <p
                                ref={textRef}
                                className={classNames(
                                    'text-xl text-white md:w-96',
                                    textAnimationClass,
                                )}
                            >
                                {t(
                                    "We're here to assist. Contact us for any inquiries or support you need.",
                                )}
                            </p>
                            <div
                                ref={buttonRef}
                                className={buttonAnimationClass}
                            >
                                <TrackedButtonOrLink
                                    size="lg"
                                    variant="underlined-secondary"
                                    mode="dark"
                                    bodyClassName="ps-0"
                                    href="/contact"
                                    withRightArrow
                                    text={t('Get in touch')}
                                    measurementListId="reach out section contact page link"
                                />
                            </div>
                        </div>
                        <div className="border border-slate-700" />
                        <div
                            ref={expertImagesRef}
                            className={classNames(
                                'flex w-40 items-center',
                                expertImagesAnimationClass,
                            )}
                        >
                            <Image
                                loading="lazy"
                                imageSrc={adamNasliProfileImage}
                                alt="adam-nasli"
                                className="-ml-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full shadow-lg md:h-14 md:w-14"
                            />
                            <Image
                                loading="lazy"
                                imageSrc={gergoProfileImage}
                                alt="gergely-korpos"
                                className="-ml-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full shadow-lg md:h-14 md:w-14"
                            />
                            <Image
                                loading="lazy"
                                imageSrc={hikmatProfileImage}
                                alt="hikmat"
                                className="-ml-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full shadow-lg md:h-14 md:w-14"
                            />
                            <Image
                                loading="lazy"
                                imageSrc={krisztianProfileImage}
                                alt="krisztian-gatonyi"
                                className="-ml-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full shadow-lg md:h-14 md:w-14"
                            />
                            <Image
                                loading="lazy"
                                imageSrc={theresaProfileImage}
                                alt="theresa"
                                className="-ml-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full shadow-lg md:h-14 md:w-14"
                            />
                        </div>
                        <div
                            ref={button2Ref}
                            className={classNames(
                                button2AnimationClass,
                                'z-10',
                            )}
                        >
                            <TrackedButtonOrLink
                                href="/team/analysts-editors"
                                variant="underlined-primary"
                                size="lg"
                                bodyClassName="ps-0"
                                mode="dark"
                                withRightArrow
                                text={t('Meet our experts')}
                                measurementListId="reach out section editors page link"
                            />
                        </div>
                    </div>
                </Column>
                <Column>
                    <Image
                        imageSrc={reachOutGroupImage}
                        alt="Reach out to us"
                        fitToCenter
                        className="h-full min-h-72 w-full md:min-h-96"
                        loading="lazy"
                    />
                </Column>
            </TwoColumn>
        </SectionWrapper>
    );
};
