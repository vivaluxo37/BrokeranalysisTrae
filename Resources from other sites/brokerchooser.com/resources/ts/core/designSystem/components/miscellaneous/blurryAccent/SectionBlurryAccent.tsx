import {
    BlurryAccent,
    BlurryAccentProps,
} from '@design-system/components/miscellaneous/blurryAccent/BlurryAccent';
import React, { FC } from 'react';

export const SectionBlurryAccent: FC<BlurryAccentProps> = (props) => (
    <BlurryAccent
        {...props}
        className="right-0 top-[50%] h-[50%] w-[15%] -translate-y-1/2 translate-x-3/4 bg-primary-500/15"
    />
);
