import { onVisitBrokerButtonClick } from './onVisitBrokerButtonClick';
import { tryExtractAttributesFromOldVisitBrokerButton } from './tryExtractAttributesFromOldVisitBrokerButton';

export function initializeOpenAccountButton(element: HTMLElement): void {
    const args = tryExtractAttributesFromOldVisitBrokerButton(element);

    if (!args) {
        return;
    }

    const clickEventHandler = (event: Event) =>
        onVisitBrokerButtonClick(event, args);

    element.addEventListener('click', clickEventHandler);
    element.addEventListener('auxclick', clickEventHandler);
}
