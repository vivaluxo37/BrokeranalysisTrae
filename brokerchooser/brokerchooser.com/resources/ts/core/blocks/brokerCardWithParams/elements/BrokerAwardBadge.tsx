import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BCTooltip } from '../../../elements/BCTooltip';

export const BrokerAwardBadge: FC<{
    award: string;
    onClick: () => void;
}> = ({ award, onClick }) => {
    const { t } = useTranslation();
    return (
        <BCTooltip content={award} className="flex justify-center">
            <a
                href="/best-broker-awards"
                onClick={onClick}
                className="ms-2 flex items-center justify-center rounded bg-gradient-to-r from-primary-200 via-primary-50 to-primary-200 px-2 py-1.5 text-[10px] uppercase leading-none text-slate-800"
            >
                <span className="inline-block align-middle font-bold">
                    {t('[year] Award Winner', {
                        year: 2025,
                    })}
                </span>
            </a>
        </BCTooltip>
    );
};
