import React, { FC, PropsWithChildren } from 'react';

export const SkeletonMessageOverlay: FC<PropsWithChildren> = ({ children }) => (
    <div className="absolute right-0 top-0 z-20 flex h-full w-full items-center justify-center rounded-b-3xl bg-white bg-[url(/public/images/assistant/archive.svg)] bg-auto bg-left-bottom bg-repeat-y">
        {children}
    </div>
);
