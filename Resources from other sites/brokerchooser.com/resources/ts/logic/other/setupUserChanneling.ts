import {
    getGeneralElementClickEventData,
    getGeneralElementImpressionEventData,
} from '../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../util/measurement/functions/sendGA4Event';
import { setupHumanEyeVisibilityCheck } from '../elem_on_screen/setupHumanEyeVisibilityCheck';

export const setupUserChanneling = () => {
    document
        .querySelectorAll<HTMLElement>('.marker--user_channeling')
        .forEach((element) => {
            const { label, category: overrideCategory } = element.dataset;

            const category = overrideCategory || 'user-channeling'; // TODO is overrideCategory used in json?? I think its not used

            if (label === undefined) {
                console.error(
                    'No parameters found on user channeling target',
                    label,
                );
                return;
            }

            element.addEventListener('click', () => {
                const event = getGeneralElementClickEventData({
                    measurementListId: category,
                    elementId: label,
                });

                sendGA4Event(event);
            });

            setupHumanEyeVisibilityCheck({
                element,
                onElementVisible: () => {
                    const event = getGeneralElementImpressionEventData({
                        measurementListId: category,
                        elementId: label,
                    });

                    sendGA4Event(event);
                },
            });
        });
};
