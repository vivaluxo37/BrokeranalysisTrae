import React from 'react';
import { MainPage } from '../../mainPage/MainPage';
import { MainPageProps } from '../../mainPage/types/MainPageProps';

const MainPageIndex: React.FC<MainPageProps> = (props) => (
    <MainPage {...props} />
);
export default React.memo(MainPageIndex);
