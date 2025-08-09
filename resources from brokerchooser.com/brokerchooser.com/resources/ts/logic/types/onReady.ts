export const onReady = (action: () => void): void => {
    console.debug('onReady');

    const wrapped = () => {
        try {
            action();
        } catch (e) {
            console.error(e);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wrapped);
    } else {
        wrapped();
    }
};
