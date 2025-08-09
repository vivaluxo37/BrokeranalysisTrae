import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../../elements/Dialog';
import { NotRegisteredDialogContent } from './NotRegisteredDialogContent';

export const NotRegisteredDialog: FC<{
    showDialog: boolean;
    setShowDialog: React.SetStateAction<any>;
    measurementListId: string;
}> = ({ showDialog, setShowDialog, measurementListId }) => {
    const { t } = useTranslation();

    return (
        <Dialog
            isComponentVisible={showDialog}
            onDialogClose={() => setShowDialog(false)}
            dialogClasses="w-full max-w-[500px]"
        >
            <NotRegisteredDialogContent
                title={t('Nice broker pick!')}
                text={t(
                    "We've saved this broker to your shortlist. Create your personal page to access it and receive updates.",
                )}
                icon={
                    <HandThumbUpIcon className="mb-4 h-14 w-14 rounded-full bg-slate-100 p-2 text-secondary-500" />
                }
                measurementListId={measurementListId}
            />
        </Dialog>
    );
};
