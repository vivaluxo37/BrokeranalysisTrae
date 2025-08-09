import React, { FC } from 'react';

export const FacebookIcon: FC<{
    fill?: string;
    className?: string;
    fillClassName?: string;
}> = ({ fill = '#1877F2', className, fillClassName }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <g id="Frame" clipPath="url(#clip0_4181_15389)">
            <path
                id="Vector"
                d="M20.0001 10.0613C20.0001 4.50378 15.5226 -0.0012207 10.0001 -0.0012207C4.47506 2.9297e-05 -0.00244141 4.50378 -0.00244141 10.0625C-0.00244141 15.0838 3.65506 19.2463 8.43506 20.0013V12.97H5.89756V10.0625H8.43756V7.84378C8.43756 5.32253 9.93131 3.93003 12.2151 3.93003C13.3101 3.93003 14.4538 4.12628 14.4538 4.12628V6.60128H13.1926C11.9513 6.60128 11.5638 7.37753 11.5638 8.17378V10.0613H14.3363L13.8938 12.9688H11.5626V20C16.3426 19.245 20.0001 15.0825 20.0001 10.0613Z"
                fill={fill}
                className={fillClassName}
            />
        </g>
        <defs>
            <clipPath id="clip0_4181_15389">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </svg>
);
