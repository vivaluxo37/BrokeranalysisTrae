import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { FooterNavigationItem } from '@design-system/components/navigation/footerNavigationItem/FooterNavigationItem';
import 'lazysizes';
import React, { FC } from 'react';
import { DisclaimerTexts } from './elements/DisclaimerTexts';
import { FooterBottomLinks } from './elements/FooterBottomLinks';
import { FooterPropsType } from './types/types';

export const Footer: FC<FooterPropsType> = ({ navigationColumns }) => (
    <footer className="relative bottom-0 z-25 flex flex-col gap-10 bg-slate-800 py-12">
        <SectionWrapper innerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {navigationColumns.map(({ title, navigationItems }) => (
                <nav className="flex flex-col gap-3" key={title}>
                    <div className="font-semibold uppercase text-slate-200">
                        {title}
                    </div>
                    <ul>
                        {navigationItems.map(({ url, elementId, label }) => (
                            <li key={elementId}>
                                <FooterNavigationItem
                                    url={url}
                                    elementId={elementId}
                                    measurementListId="footer"
                                    newTab={false}
                                >
                                    {label}
                                </FooterNavigationItem>
                            </li>
                        ))}
                    </ul>
                </nav>
            ))}
        </SectionWrapper>
        <SectionWrapper>
            <div className="h-px w-full bg-slate-700" />
        </SectionWrapper>
        <SectionWrapper innerClassName="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DisclaimerTexts />
            <FooterBottomLinks />
        </SectionWrapper>
    </footer>
);
