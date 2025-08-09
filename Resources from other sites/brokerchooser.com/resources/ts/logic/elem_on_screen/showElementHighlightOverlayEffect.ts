/**
 * much more comprehensive debug than border, because:
 * - shows if hidden elements were triggered
 * - shows triggers behind the collapsable header
 */
export const showElementHighlightOverlayEffect = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    // const { height, left, top, width } = element.getBoundingClientRect();

    const markerElement = document.createElement('div') as HTMLDivElement;

    markerElement.style.cssText = `
            position: fixed;
            left: ${rect.left}px;
            top: ${rect.top}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            background: red;
            transform-origin: center;
            transition: transform 2s ease-out, background 1.5s linear;
            transform: scale(1.0);
            z-index: 100000;
            border-radius: 10px;
        `;

    document.body.appendChild(markerElement);

    setTimeout(() => {
        // much more opacity
        markerElement.style.background = '#ff000033';
        markerElement.style.transform = 'scale(2.0)';
    }, 50);

    setTimeout(() => {
        document.body.removeChild(markerElement);
    }, 2000);
};
