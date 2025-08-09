import 'lazysizes';
import React, { FC } from 'react';
import { AskNuri } from '../core/blocks/askNuri/AskNuri';
import { ForumSection } from '../core/blocks/forum/ForumSection';
import { BestBrokersSection } from './blocks/bestBrokers/BestBrokersSection';
import { CompareSection } from './blocks/compare/CompareSection';
import { ExpertiseSection } from './blocks/expertise/ExpertiseSection';
import { FaqSection } from './blocks/faq/FaqSection';
import { HeroSection } from './blocks/hero/HeroSection';
import { OurApproachSection } from './blocks/ourApproach/OurApproachSection';
import { PromotedBestBrokersSection } from './blocks/promotedBestBrokers/PromotedBestBrokersSection';
import { ReachOutSection } from './blocks/reachOut/ReachOutSection';
import { SuccessStories } from './blocks/successStories/SuccessStories';
import { MainPageProps } from './types/MainPageProps';

export const MainPage: FC<MainPageProps> = ({
    countryTheName,
    accountOpens,
    topCountryBrokers,
    testimonials,
    promotedBestBrokers,
}) => (
    <div className="flex flex-col gap-5 bg-slate-100">
        <HeroSection />
        <PromotedBestBrokersSection winners={promotedBestBrokers} />
        <BestBrokersSection
            country={countryTheName}
            topCountryBrokers={topCountryBrokers}
        />
        <AskNuri />
        <OurApproachSection />
        <CompareSection />
        <ForumSection />
        <ExpertiseSection accountOpens={accountOpens} />
        <SuccessStories testimonials={testimonials} />
        <ReachOutSection />
        <FaqSection />
    </div>
);
