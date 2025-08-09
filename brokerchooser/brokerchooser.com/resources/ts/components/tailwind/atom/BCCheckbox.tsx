import classNames from 'classnames';
import React, { FC } from 'react';

export const BCCheckbox: FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    Label: FC;
    className?: string;
    checkBoxClassName?: string;
    hasError?: boolean;
    disabled?: boolean;
    checkboxId?: string;
}> = ({
    checked,
    className,
    checkboxId,
    disabled,
    checkBoxClassName,
    hasError,
    onChange,
    Label,
}) => (
    <div className={classNames('flex', className)}>
        <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={(event) => !disabled && onChange(event.target.checked)}
            className={classNames(
                checkBoxClassName,
                hasError ? 'border-danger-500' : 'border-secondary-500',
            )}
            disabled={disabled}
        />
        <div
            className={classNames('ms-4', {
                'text-danger-500': hasError,
                'text-gray-500': disabled,
            })}
        >
            <Label />
        </div>
    </div>
);
