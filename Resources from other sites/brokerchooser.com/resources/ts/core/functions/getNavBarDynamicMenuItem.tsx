import React, { ReactNode } from 'react';
import { reportError } from '../../logic/util/error/reportError';

export const getNavBarDynamicMenuItem = (props: {
    componentName: string;
    eventHandler: (label: string) => void;
}): ReactNode => {
    const { componentName, eventHandler } = props;
    switch (componentName) {
        case 'storybook_demo': {
            return (
                <button
                    type="button"
                    onClick={() => eventHandler(componentName)}
                >
                    Demo
                </button>
            );
        }
        default: {
            reportError(
                new Error(
                    `NavBarDynamicMenuItem: Unknown id: ${componentName}`,
                ),
            );
            return <div />;
        }
    }
};
