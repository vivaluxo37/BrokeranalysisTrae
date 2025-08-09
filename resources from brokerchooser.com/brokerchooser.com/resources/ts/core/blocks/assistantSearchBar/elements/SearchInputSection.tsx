import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { Input } from '@design-system/components/inputs/inputs/Input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { FC, KeyboardEvent, useMemo, useState } from 'react';
import { getSearchEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { useAssistantInteractions } from '../../assistant/hooks/useAssistantInteractions';
import { ASSISTANT_SEARCH_BAR_MEASUREMENT_LIST_ID } from '../consts/measurementIds';
import { SearchSectionWrapper } from './SearchSectionWrapper';

export const SearchInputSection: FC = () => {
    const [input, setInput] = useState('');

    const { onSearchQuerySubmit } = useAssistantInteractions();
    const isGenerating = useGlobalStore(
        (state) => state.assistant.common.isGenerating,
    );

    const searchEvent = useMemo(
        () =>
            getSearchEventData({
                measurementListId: ASSISTANT_SEARCH_BAR_MEASUREMENT_LIST_ID,
                searchTerm: input,
            }),
        [input],
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return;
        }

        onSearchQuerySubmit(input, searchEvent).then();
    };

    const handleSubmitClick = () => onSearchQuerySubmit(input, searchEvent);

    return (
        <SearchSectionWrapper className="flex gap-x-2">
            <Input
                autoFocus
                className="w-full"
                disabled={isGenerating}
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
            />
            <ButtonOrLink
                text=""
                bodyClassName="!px-0"
                disabled={isGenerating || input.length === 0}
                onClick={handleSubmitClick}
            >
                <MagnifyingGlassIcon className="size-5" />
            </ButtonOrLink>
        </SearchSectionWrapper>
    );
};
