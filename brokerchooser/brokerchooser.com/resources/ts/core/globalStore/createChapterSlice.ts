import { StateCreator } from 'zustand';
import { PageScrollState } from '../../logic/page_scroll_behaviour';
import { INVALID_CHAPTER } from './consts/constants';
import { Chapter, ChaptersSlice } from './types/ChapterSlice';
import { GlobalState } from './types/GlobalState';

export const createChaptersSlice: StateCreator<
    GlobalState,
    [['zustand/immer', never]],
    [],
    ChaptersSlice
> = (set) => ({
    chapters: [],
    selectedChapter: INVALID_CHAPTER,
    pageScroll: { positionNamed: 'top', position: 0, maxScrollPosition: 0 },
    setChapters: (values: Chapter[]) => {
        set((state) => {
            state.chapters.chapters = values;
        });
    },
    setSelectedChapter: (activeChapter: Chapter) => {
        set((state) => {
            state.chapters.selectedChapter = activeChapter;
        });
    },
    setPageScroll: (pageScroll: PageScrollState) => {
        set((state) => {
            state.chapters.pageScroll = pageScroll;
        });
    },
});
