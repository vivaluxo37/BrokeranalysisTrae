import classNames from 'classnames';
import React, { CSSProperties, useCallback } from 'react';

type Props = {
    className?: string;
    imageSrc: string;
    onClick?: () => void;
    /**
     * Exposed property so that no w-[12px] classes are necessary.
     */
    style?: CSSProperties;
};

/**
 * No sizing, just the common setup
 */
export const ImageAsBackground: React.FunctionComponent<Props> = ({
    onClick,
    style,
    imageSrc,
    className,
}) => {
    const handleClick = useCallback(() => {
        onClick?.();
    }, [onClick]);

    return (
        <div
            className={classNames(
                'bg-contain bg-center bg-no-repeat',
                {
                    'cursor-pointer': onClick,
                },
                className,
            )}
            style={{
                ...style,
                backgroundImage: `url(${imageSrc})`,
            }}
            onClick={handleClick}
        />
    );
};
