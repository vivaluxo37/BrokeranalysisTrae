import { RefObject } from 'react';
import { globalStore } from '../../../globalStore/globalStore';
import { SystemMessageType } from '../consts/SystemMessageType';

// Time until the user is inactive, no interactions with NURI
const INACTIVITY_TIME = 20000; // 20 sec

class FeedbackSystemMessageHandler {
    private modalBodyRef: RefObject<HTMLDivElement> | null = null;

    private inputRef: RefObject<HTMLInputElement> | null = null;

    private inactivityTimeout: NodeJS.Timeout | undefined;

    public isListeningToInactivity = false;

    public setModalBodyRef = (modalBodyRef: RefObject<HTMLDivElement>) => {
        this.modalBodyRef = modalBodyRef;
    };

    public removeModalBodyRef = () => {
        this.modalBodyRef = null;
    };

    public setInputRef = (inputRef: RefObject<HTMLInputElement>) => {
        this.inputRef = inputRef;
    };

    public removeInputRef = () => {
        this.inputRef = null;
    };

    // User is inactive if didn't click in the modal and didn't type in the input field for INACTIVITY_TIME
    public startListeningForInactivity = () => {
        this.modalBodyRef?.current?.addEventListener(
            'click',
            this.resetInactivityTimer,
        );
        this.inputRef?.current?.addEventListener(
            'input',
            this.resetInactivityTimer,
        );
        this.startInactivityTimer();
        this.isListeningToInactivity = true;
    };

    public stopListeningForInactivity = () => {
        this.stopInactivityTimer();
        this.modalBodyRef?.current?.removeEventListener(
            'click',
            this.resetInactivityTimer,
        );
        this.inputRef?.current?.removeEventListener(
            'input',
            this.resetInactivityTimer,
        );
        this.isListeningToInactivity = false;
    };

    public resetInactivityTimer = () => {
        this.stopInactivityTimer();
        this.startInactivityTimer();
    };

    private handleInactivity = () => {
        this.stopListeningForInactivity();
        globalStore
            .getState()
            .assistant.chat.actions.appendNewSystemMessage(
                SystemMessageType.FEEDBACK,
            );
    };

    private stopInactivityTimer = () => {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
    };

    private startInactivityTimer = () => {
        this.inactivityTimeout = setTimeout(() => {
            this.handleInactivity();
        }, INACTIVITY_TIME);
    };
}

export default new FeedbackSystemMessageHandler();
