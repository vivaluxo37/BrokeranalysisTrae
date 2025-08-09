import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { Input } from '@design-system/components/inputs/inputs/Input';
import { ColorMode } from '@design-system/types/coreTypes';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, {
    FC,
    KeyboardEvent,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useIsAssistantVoiceFakeDoorAbTestRunning } from '../../../hooks/abTest/specific/useIsAssistantVoiceFakeDoorAbTestRunning';
import { TrackedFakeDoorButton } from '../blocks/assistantFakeDoor/elements/TrackedFakeDoorButton';
import feedbackSystemMessageHandlerInstance from '../functions/FeedbackSystemMessageHandler';
import { useAssistantInputBar } from '../hooks/useAssistantInputBar';
import { useAssistantInteractions } from '../hooks/useAssistantInteractions';

export const AssistantInputBar: FC<{
    autoFocus?: boolean;
    className?: string;
    hideDisclaimer?: boolean;
    inputClassName?: string;
    mode?: ColorMode;
    newChatOnSubmit?: boolean;
    placeholder?: string;
    enableFakeDoor?: boolean;
}> = ({
    autoFocus = false,
    className,
    hideDisclaimer = false,
    inputClassName,
    mode = 'light',
    newChatOnSubmit = true,
    placeholder,
    enableFakeDoor = false,
}) => {
    const { t } = useTranslation();
    const { input, isInputDisabled, setInput } = useAssistantInputBar();
    const { onContinueChat, onOpenWithNewChat, queryError } =
        useAssistantInteractions();

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        feedbackSystemMessageHandlerInstance.setInputRef(inputRef);
        return () => {
            feedbackSystemMessageHandlerInstance.removeInputRef();
        };
    }, []);

    const handleSubmit = useCallback(async () => {
        if (newChatOnSubmit) {
            await onOpenWithNewChat(input);
        } else {
            await onContinueChat(input);
        }

        setInput('');
    }, [input, newChatOnSubmit, onContinueChat, onOpenWithNewChat, setInput]);

    const handleKeyDownEvent = useCallback(
        async (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') {
                return;
            }

            event.preventDefault();

            if (newChatOnSubmit) {
                await onOpenWithNewChat(input);
            } else {
                await onContinueChat(input);
            }

            setInput('');
        },
        [input, newChatOnSubmit, onContinueChat, onOpenWithNewChat, setInput],
    );

    return (
        <div
            className={classNames(
                'flex shrink-0 flex-col items-center gap-y-6 rounded-3xl p-4 !pt-0 lg:p-8 lg:ps-0',
                className,
            )}
        >
            <div className="flex w-full items-start gap-x-2">
                <Input
                    IconRight={
                        useIsAssistantVoiceFakeDoorAbTestRunning() &&
                        enableFakeDoor
                            ? TrackedFakeDoorButton
                            : undefined
                    }
                    ref={inputRef}
                    autoFocus={autoFocus}
                    className={classNames(
                        'w-full rounded-lg',
                        isInputDisabled ? 'bg-slate-100' : 'bg-white',
                        inputClassName,
                    )}
                    disabled={isInputDisabled}
                    onChange={(e) => setInput(e.currentTarget.value)}
                    onKeyDown={handleKeyDownEvent}
                    placeholder={
                        placeholder || t('How can I help? I’m all ears!')
                    }
                    value={input}
                    errorDescription={queryError}
                />
                <ButtonOrLink
                    text="Submit"
                    mode={mode}
                    size="md"
                    variant="primary"
                    className="flex-grow py-3.5"
                    bodyClassName="!px-0 flex-grow py-px"
                    disabled={isInputDisabled || input.length === 0}
                    onClick={handleSubmit}
                >
                    <PaperAirplaneIcon className="size-5 rtl:scale-x-[-1]" />
                </ButtonOrLink>
            </div>
            {!hideDisclaimer && (
                <div className="text-center text-xs text-slate-500">
                    {t(
                        'Nuri helps with data on 100+ brokers but may make mistakes.',
                    )}
                </div>
            )}
        </div>
    );
};
