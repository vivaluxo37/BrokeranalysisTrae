import { Chapter } from '../types/ChapterSlice';

export const INVALID_CHAPTER: Chapter = {
    index: -1,
    name: 'INVALID',
    id: '_invalid',
};

export enum RegistrationModalFlowType {
    PortfolioTracker = 'portfolio-tracker',
    AddPTAccount = 'add-pt-account',
}
