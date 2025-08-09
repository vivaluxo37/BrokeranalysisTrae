import classNames from 'classnames';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BCInputField } from '../../components/tailwind/atom/BCInputField';
import { PageTitle } from '../../components/tailwind/atom/PageTitle';
import { SectionTitle } from '../../components/tailwind/atom/SectionTitle';
import { LegacySectionWrapper } from '../../components/tailwind/template/LegacySectionWrapper';
import { CheckboxProps, FilterGroup } from './FilterGroup';

type TitleSectionProps = {
    searchString: string;
    onSearchChange: (searchString: string) => void;
    onFilterChange: (checkBox: CheckboxProps) => void;
    checkBoxes: CheckboxProps[];
};

export const TitleSection: FC<TitleSectionProps> = ({
    onSearchChange,
    onFilterChange,
    searchString,
    checkBoxes,
}) => {
    const { t } = useTranslation();

    return (
        <LegacySectionWrapper
            innerClassName="flex flex-col items-center"
            outerPaddingClassName="py-4 sm:py-10"
        >
            <PageTitle disableMargin className="mb-3 text-center">
                {t('Broker reviews')}
            </PageTitle>
            <div className="w-5/12 border-b-2 border-primary-500" />
            <SectionTitle disableMargin className="mb-3 mt-3" center>
                {t('Find the right broker and invest on your own')}
            </SectionTitle>
            <div
                className={classNames(
                    'w-full max-w-md',
                    'flex flex-col items-end gap-x-4',
                )}
            >
                <BCInputField
                    className="w-full flex-1"
                    value={searchString}
                    onChange={onSearchChange}
                    placeholder={t('Type broker name')}
                    label={{
                        text: t('Filter by name'),
                        className: 'text-sm ms-2 mb-2 mt-4',
                    }}
                    search
                />
            </div>
            <FilterGroup
                onCheckedChanged={onFilterChange}
                checkboxes={checkBoxes}
                className={classNames(
                    'mt-6',
                    'grid grid-cols-3 gap-x-10 gap-y-2',
                    'sm:flex sm:flex-row sm:gap-x-6',
                )}
            />
        </LegacySectionWrapper>
    );
};
