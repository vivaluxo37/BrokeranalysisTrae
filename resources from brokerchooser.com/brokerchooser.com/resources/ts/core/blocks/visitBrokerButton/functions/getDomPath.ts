export const getDomPath = (el: HTMLElement): string => {
    const stack = [];

    while (el.parentElement !== null) {
        let sameSiblingCount = 0;
        let sameSiblingIndex = 0;
        for (let i = 0; i < el.parentElement.childNodes.length; i++) {
            const sib = el.parentElement.childNodes[i];
            if (sib.nodeName === el.nodeName) {
                if (sib === el) {
                    sameSiblingIndex = sameSiblingCount;
                }
                sameSiblingCount++;
            }
        }

        // entries defines the current node as accurately as possible
        const entries = [el.nodeName.toLowerCase()];

        if (sameSiblingCount > 1) {
            entries.push(...['[', sameSiblingIndex.toString(), ']']);
        }

        if (el.classList && el.classList.length > 0) {
            entries.push(...[...el.classList].map((c) => `.${c}`));
        }

        if (el.hasAttribute && el.hasAttribute('id') && el.id !== '') {
            entries.push(...['#', el.id]);
        }

        const text = entries.join('');
        stack.unshift(text);

        el = el.parentElement;
    }

    const path = stack.slice(1); // removes the html element
    return path.join(' > ');
};
