import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import React from 'react';

const markdownOptions: MarkdownToJSX.Options = {
    overrides: {
        ul: {
            props: {
                className: 'list-outside list-disc ps-5',
            },
        },
        ol: {
            props: {
                className: 'list-outside list-decimal ps-5',
            },
        },
    },
};

export const MarkdownText: React.FC<{ content: string }> = ({ content }) => {
    if (!content) {
        return null;
    }

    return (
        <Markdown className="flex flex-col gap-y-2" options={markdownOptions}>
            {content}
        </Markdown>
    );
};
