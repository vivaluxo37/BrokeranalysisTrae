import * as React from 'react';
import { FC } from 'react';
import { BCCheckbox } from '../../components/tailwind/atom/BCCheckbox';

export type CheckboxProps = {
    id: string;
    checked?: boolean;
    text: string;
};

type FilterGroupProps = {
    className?: string;
    label?: string;
    checkboxes: CheckboxProps[];
    onCheckedChanged?: (params: CheckboxProps) => void;
};

export const FilterGroup: FC<FilterGroupProps> = ({
    label,
    checkboxes,
    className,
    onCheckedChanged,
}) => (
    <div className={className}>
        {label && <p className="pb-2 text-lg font-medium">{label}</p>}

        {checkboxes.map((checkboxProps: CheckboxProps) => (
            <BCCheckbox
                key={checkboxProps.id + checkboxProps.text}
                className="items-center"
                onChange={(checked) =>
                    onCheckedChanged &&
                    onCheckedChanged({
                        ...checkboxProps,
                        checked,
                    })
                }
                Label={() => (
                    <span className="-ms-2">{checkboxProps.text}</span>
                )}
                checked={!!checkboxProps.checked}
            />
        ))}
    </div>
);
