import React, { FC } from 'react';
import { NAVBAR_HEIGHT } from '../navbar/consts/uiConstants';
import { CloseSearchButton } from './elements/CloseSearchButton';
import { SearchAnswerSection } from './elements/SearchAnswerSection';
import { SearchInputSection } from './elements/SearchInputSection';
import { SearchResultsSections } from './elements/SearchResultsSections';
import { AssistantSearchBarProps } from './types/AssistantSearchBarProps';

export const AssistantSearchBar: FC<AssistantSearchBarProps> = ({
    onClose,
}) => (
    <div
        className="max-h-screen w-screen cursor-auto overflow-y-scroll overscroll-none transition-all"
        style={{ paddingBottom: `${NAVBAR_HEIGHT}px` }}
    >
        <CloseSearchButton onClose={onClose} />
        <SearchInputSection />
        <SearchAnswerSection onClose={onClose} />
        <SearchResultsSections />
    </div>
);
