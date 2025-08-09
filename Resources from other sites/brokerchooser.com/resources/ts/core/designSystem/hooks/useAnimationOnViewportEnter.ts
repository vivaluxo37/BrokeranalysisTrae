import { RefObject, useEffect, useState } from 'react';
import { setupHumanEyeVisibilityCheck } from '../../../logic/elem_on_screen/setupHumanEyeVisibilityCheck';

export const useAnimationOnViewportEnter = (args: {
    element: RefObject<HTMLElement>;
    animationClassName: string;
    delay?: number;
    disabled?: boolean;
    rootMargin?: string;
}) => {
    const [animatedClass, setAnimatedClass] = useState<string>(
        'animation-on-viewport-enter-start',
    );

    useEffect(() => {
        if (!args.element.current) {
            return;
        }
        setupHumanEyeVisibilityCheck({
            element: args.element.current,
            onElementVisible: () => {
                setAnimatedClass(args.animationClassName);
            },
            visibleAfterMillis: args.delay || 0,
            rootMargin: args.rootMargin,
        });
    }, [args.animationClassName, args.delay, args.element, args.rootMargin]);

    if (args.disabled) {
        return '';
    }

    return animatedClass;
};

export const useListAnimationOnViewportEnter = (args: {
    elements: RefObject<HTMLElement[]>;
    animationClassName: string;
    delay?: number;
}) => {
    const [animatedClasses, setAnimatedClasses] = useState<string[]>(['']);

    useEffect(() => {
        if (!args.elements.current) {
            return;
        }
        setAnimatedClasses(
            new Array(args.animationClassName.length).fill('opacity-0'),
        );
        args.elements.current.forEach((element, index) => {
            setupHumanEyeVisibilityCheck({
                element,
                onElementVisible: () => {
                    setAnimatedClasses((prevState) => {
                        const newState = [...prevState];
                        newState[index] = args.animationClassName;
                        return newState;
                    });
                },
                visibleAfterMillis: args.delay ? args.delay * index : 0,
            });
        });
    }, [args.animationClassName, args.delay, args.elements]);

    return animatedClasses;
};
