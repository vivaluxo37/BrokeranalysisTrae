import { createRelativeUrl } from '../../category-page/util/createRelativeUrl';

type BrokerData = {
    slug: string;
    name: string;
};

export const createTop2Link = (
    broker1: BrokerData,
    broker2: BrokerData,
): {
    href: string;
    linkText: string;
} => {
    const slug1 = broker1.slug;
    const slug2 = broker2.slug;

    const href = createRelativeUrl(`compare/${slug1}-vs-${slug2}`);
    const linkText = `${broker1.name} vs ${broker2.name}`;

    return {
        href,
        linkText,
    };
};
