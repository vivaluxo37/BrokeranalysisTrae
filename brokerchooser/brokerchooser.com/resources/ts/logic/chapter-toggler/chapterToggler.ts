export const toggleChapter = (chapterToggleId?: string) => {
    document
        .querySelectorAll<HTMLElement>(
            `[data-chapter-toggle-id=${chapterToggleId}]`,
        )
        .forEach((item) => {
            item.querySelector('.closed-state')?.classList.toggle('hidden');
            item.querySelector('.opened-state')?.classList.toggle('hidden');
        });
};

function initializeChapterToggleButton(element: HTMLElement) {
    element.addEventListener('click', (e) => {
        const currentElement = e.currentTarget as HTMLElement;
        const { chapterToggleId } = currentElement.dataset;

        toggleChapter(chapterToggleId);

        if (
            currentElement.classList.contains('toggle-with-scroll') &&
            currentElement
                .querySelector('.opened-state')
                ?.classList.contains('hidden')
        ) {
            document
                .querySelector(
                    `.bc_broker_review_body_section_title#${chapterToggleId}`,
                )
                ?.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

export function initChapterToggleBtn() {
    document
        .querySelectorAll<HTMLElement>('.chapter-toggler')
        .forEach((element) => {
            initializeChapterToggleButton(element);
        });
}
