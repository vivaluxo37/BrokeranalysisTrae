import { getGeneralElementClickEventData } from '../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../util/measurement/functions/sendGA4Event';

export const setupAuthenticationEvents = () => {
    const elements = [
        {
            selector: '.submit-registration',
            measurementListId: 'register button',
            eventType: 'submit',
        },
        {
            selector: '.register-facebook-button',
            measurementListId: 'facebook button',
            eventType: 'click',
        },
        {
            selector: '.register-google-button',
            measurementListId: 'google button',
            eventType: 'click',
        },
        {
            selector: '.already-have-account-link',
            measurementListId: 'already have account',
            eventType: 'click',
        },
        {
            selector: '.forgot-password-link',
            measurementListId: 'forgot password',
            eventType: 'click',
        },
        {
            selector: '.submit-login',
            measurementListId: 'login button',
            eventType: 'submit',
        },
        {
            selector: '.login-facebook-button',
            measurementListId: 'login facebook button',
            eventType: 'click',
        },
        {
            selector: '.login-google-button',
            measurementListId: 'login google button',
            eventType: 'click',
        },
        {
            selector: '.registration-link',
            measurementListId: 'register account link',
            eventType: 'click',
        },
        {
            selector: '.submit-reset-password',
            measurementListId: 'reset password email button',
            eventType: 'submit',
        },
        {
            selector: '.submit-save-settings',
            measurementListId: 'save profile settings',
            eventType: 'submit',
        },
        {
            selector: '.submit-new-password',
            measurementListId: 'set new password',
            eventType: 'submit',
        },
        {
            selector: '.submit-notification-setting',
            measurementListId: 'change notification setting',
            eventType: 'submit',
        },
    ];

    const addEventListenerWithGA4Event = (
        element: HTMLElement,
        measurementListId: string,
        eventType: string,
    ) => {
        if (element) {
            element.addEventListener(eventType, () => {
                const eventData = getGeneralElementClickEventData({
                    measurementListId,
                });
                sendGA4Event(eventData);
            });
        }
    };

    elements.forEach(({ selector, measurementListId, eventType }) => {
        const element = document.querySelector(selector) as HTMLElement;
        addEventListenerWithGA4Event(element, measurementListId, eventType);
    });
};
