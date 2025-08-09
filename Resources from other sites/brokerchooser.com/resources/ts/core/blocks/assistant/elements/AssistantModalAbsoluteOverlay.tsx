import React, { PropsWithChildren } from 'react';

export const AssistantModalAbsoluteOverlay: React.FC<PropsWithChildren> = ({
    children,
}) => (
    <div className="absolute inset-0 flex size-full flex-col justify-between">
        {children}
    </div>
);
