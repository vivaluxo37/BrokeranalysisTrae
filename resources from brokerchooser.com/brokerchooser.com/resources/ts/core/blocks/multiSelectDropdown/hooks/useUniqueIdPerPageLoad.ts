import { useEffect, useState } from 'react';

// no numbers so it is easier to manage
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// HTML element id cannot should not start with number, selector may not work
const generateRandomString = () => {
    const result: string[] = [];

    for (let i = 0; i < 20; i++) {
        const randomChar = characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
        result.push(randomChar);
    }

    return result.join('');
};

export const useUniqueIdPerPageShow = (): string => {
    const [selectId, setSelectId] = useState(generateRandomString);

    useEffect(() => {
        const onPageShow = () => {
            const newId = generateRandomString();
            setSelectId(newId);
        };

        window.addEventListener('pageshow', onPageShow);

        return () => {
            window.removeEventListener('pageshow', onPageShow);
        };
    }, []);

    return selectId;
};
