import classNames from 'classnames';
import React, {
    FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { PaginationBulletsProps } from './types';

const MAX_NR_OF_BULLETS = 5;
export const PaginationBullets: FC<PaginationBulletsProps> = ({
    currentIndex,
    numberOfItems,
    bgColorClass = 'bg-secondary-500',
    bulletSize = 8,
}) => {
    const selectedIndex = useMemo(() => {
        if (numberOfItems <= MAX_NR_OF_BULLETS) {
            return currentIndex;
        }
        const midIndex = Math.floor(MAX_NR_OF_BULLETS / 2);
        // First part
        if (currentIndex < midIndex) {
            return currentIndex;
        }
        // Last part
        if (currentIndex > numberOfItems - 3) {
            return MAX_NR_OF_BULLETS - (numberOfItems - currentIndex);
        }
        // The middle dot is selected
        return midIndex;
    }, [currentIndex, numberOfItems]);

    const getBulletSize = useCallback(
        (bulletIndex: number) => {
            if (numberOfItems <= MAX_NR_OF_BULLETS) {
                return 'w-2 h-2';
            }
            let distFromSelected = Math.abs(bulletIndex - selectedIndex);

            // If the middle bullet is selected the bullets on both ends should shrink
            const midIndex = Math.floor(MAX_NR_OF_BULLETS / 2);
            if (midIndex === selectedIndex) {
                distFromSelected += 1;
            }

            if (distFromSelected > 3) {
                return bulletSize === 12 ? 'w-1.5 h-1.5' : 'w-1 h-1';
            }
            if (distFromSelected > 2) {
                return bulletSize === 12 ? 'w-2 h-2' : 'w-1.5 h-1.5';
            }
            return bulletSize === 12 ? 'w-3 h-3' : 'w-2 h-2';
        },
        [numberOfItems, selectedIndex, bulletSize],
    );

    const maxWidth = useMemo(() => {
        if (bulletSize === 8) {
            return MAX_NR_OF_BULLETS * 12;
        }

        return MAX_NR_OF_BULLETS * 16;
    }, [bulletSize]);

    const [animatedClass, setAnimatedClass] = useState<string>('');
    const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
    const slideRightToLeft = useCallback(() => {
        setAnimatedClass('transition-all duration-200 pe-6');
        setAnimatedIndex(selectedIndex + 1);
        setTimeout(() => {
            setAnimatedClass('');
            setAnimatedIndex(null);
        }, 200);
    }, [selectedIndex]);

    const slideLeftToRight = useCallback(() => {
        setAnimatedClass('transition-all duration-200 ps-6');
        setAnimatedIndex(selectedIndex - 1);
        setTimeout(() => {
            setAnimatedClass('');
            setAnimatedIndex(null);
        }, 200);
    }, [selectedIndex]);

    const prevIndexRef = useRef(currentIndex);
    useEffect(() => {
        if (
            currentIndex === prevIndexRef.current ||
            numberOfItems <= MAX_NR_OF_BULLETS ||
            selectedIndex < 2 ||
            selectedIndex > MAX_NR_OF_BULLETS - 3
        ) {
            return;
        }
        if (currentIndex > prevIndexRef.current) {
            slideRightToLeft();
        } else {
            slideLeftToRight();
        }
        prevIndexRef.current = currentIndex;
    }, [
        currentIndex,
        slideLeftToRight,
        slideRightToLeft,
        numberOfItems,
        selectedIndex,
    ]);

    return (
        <div
            style={{
                maxWidth: `${maxWidth}px`,
            }}
            className={classNames(
                'flex items-center justify-center gap-[5px] overflow-hidden rtl:flex-row-reverse',
                animatedClass,
            )}
        >
            {numberOfItems > MAX_NR_OF_BULLETS && (
                <div
                    className={classNames(
                        'h-1.5 w-1.5 shrink-0 rounded-full opacity-30',
                        bgColorClass,
                    )}
                />
            )}
            {[...Array(Math.min(numberOfItems, MAX_NR_OF_BULLETS))].map(
                (value, i) => (
                    <div
                        key={i}
                        className={classNames(
                            'shrink-0 rounded-full transition-[height] duration-200',
                            bgColorClass,
                            (animatedIndex || selectedIndex) === i
                                ? 'opacity-100'
                                : 'opacity-30',
                            getBulletSize(i),
                        )}
                    />
                ),
            )}
            {numberOfItems > MAX_NR_OF_BULLETS && (
                <div
                    className={classNames(
                        'h-1.5 w-1.5 shrink-0 rounded-full opacity-30',
                        bgColorClass,
                    )}
                />
            )}
        </div>
    );
};
