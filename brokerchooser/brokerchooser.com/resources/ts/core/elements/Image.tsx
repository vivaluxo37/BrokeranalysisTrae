import classNames from 'classnames';
import React, { CSSProperties, forwardRef, useState } from 'react';
import { OptimizedImageSrcSets } from '../assets/types';
import { ImagePlaceholder } from './icons/ImagePlaceholder';

/**
 * Image Component
 *
 * A flexible image component supporting multiple formats (e.g., WebP, PNG),
 * lazy loading, and placeholders for error or loading states.
 *
 * @example
 * // Basic Usage
 * <Image
 *     imageSrc="example.png"
 *     alt="Example image"
 *     placeholderSize="sm"
 * />
 *
 * @param {OptimizedImageSrcSets|string} imageSrc - The image source or an object containing multiple formats.
 * @param {string} alt - Alternative text for the image (required).
 * @param {string} className - Optional additional CSS classes.
 * @param {React.CSSProperties} style - Inline styles for the img tag.
 * @param {'lazy'|'eager'} loading='eager' - setting this to lazy turn on lazy loading behaviour. Make sure that lazysizes package is imported on the page
 * @param {boolean} fitToCenter=false - Whether to center the image using absolute positioning.
 * @param {boolean} hasPlaceholder - Whether to turn on placeholder presentation if the image is loading or fails to load
 * @param {'sm'|'lg'} placeholderSize='sm' - Size of the placeholder icon to show when the image is loading or fails to load.
 * @param {string} placeholderClass - Additional CSS classes for the placeholder.
 */

export const Image = forwardRef<
    HTMLDivElement,
    {
        imageSrc: OptimizedImageSrcSets | string;
        alt: string;
        className?: string;
        style?: CSSProperties;
        loading?: 'lazy' | 'eager';
        fitToCenter?: boolean;
        hasPlaceholder?: boolean;
        placeholderSize?: 'sm' | 'lg';
        placeholderClass?: string;
    }
>(
    (
        {
            imageSrc,
            loading = 'eager',
            className,
            alt,
            style,
            fitToCenter = false,
            placeholderSize = 'sm',
            placeholderClass,
            hasPlaceholder,
        },
        ref,
    ) => {
        const [error, setError] = useState(false);
        const [isLoading, setIsLoading] = useState(true);

        const imageSrcString =
            typeof imageSrc === 'object' ? imageSrc.original : imageSrc;

        return (
            <div
                aria-hidden
                ref={ref}
                className={classNames(
                    'custom-html-disabled',
                    {
                        'relative overflow-hidden': fitToCenter,
                    },
                    className,
                    placeholderClass,
                )}
            >
                {(isLoading || error) && hasPlaceholder && (
                    <ImagePlaceholder size={placeholderSize} />
                )}
                {!error && (
                    <picture
                        className={classNames({
                            'invisible block size-0 overflow-hidden':
                                isLoading && hasPlaceholder,
                        })}
                    >
                        {typeof imageSrc === 'object' && (
                            <>
                                <source
                                    type="image/webp"
                                    srcSet={
                                        loading === 'eager'
                                            ? imageSrc.webp
                                            : undefined
                                    }
                                    data-srcset={
                                        loading === 'lazy'
                                            ? imageSrc.webp
                                            : undefined
                                    }
                                    sizes="(max-width: 400px) 400px, (max-width: 700px) 700px, (max-width: 900px) 900px, 1200px"
                                />
                                <source
                                    type="image/png"
                                    srcSet={
                                        loading === 'eager'
                                            ? imageSrc.png
                                            : undefined
                                    }
                                    data-srcset={
                                        loading === 'lazy'
                                            ? imageSrc.png
                                            : undefined
                                    }
                                    sizes="(max-width: 400px) 400px, (max-width: 700px) 700px, (max-width: 900px) 900px, 1200px"
                                />
                            </>
                        )}
                        <img
                            className={classNames('h-full w-full', {
                                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover':
                                    fitToCenter,
                                lazyload: loading === 'lazy',
                            })}
                            alt={alt}
                            src={
                                loading === 'eager' ? imageSrcString : undefined
                            }
                            data-src={
                                loading === 'lazy' ? imageSrcString : undefined
                            }
                            style={style}
                            onLoad={() => {
                                if (hasPlaceholder) {
                                    setIsLoading(false);
                                }
                            }}
                            onError={() => {
                                if (hasPlaceholder) {
                                    setError(true);
                                }
                            }}
                        />
                    </picture>
                )}
            </div>
        );
    },
);

Image.displayName = 'Image';
