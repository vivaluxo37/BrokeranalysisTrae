import React from 'react';
import { IconProps } from '../../../../core/elements/icons/Icon';

export const BaseIcon = (props: IconProps & { children: React.ReactNode }) => (
    <svg
        // trick: viewBox to scale the svg properly
        viewBox="0 0 24 24"
        // trick: apply the color property as fill => CSS can be used
        fill="currentColor"
        // when specifying width and height with 1em, the text size specifications
        // will not work anymore, only pixel-based
        // style={{ width: '1em', height: '1em' }}
        {...props}
    />
);
