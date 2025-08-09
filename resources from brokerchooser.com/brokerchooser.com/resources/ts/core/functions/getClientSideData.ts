import { getInertiaGlobalPage } from '../../inertia/ssr/inertiaGlobalPage';
import { isServer } from '../../util/isServer';
import { ClientSideData } from '../types/ClientSideDataType';

let clientSideData: ClientSideData;

function calculateClientSideData() {
    const clientSideDataEncoded = document.body.dataset.clientSideData;

    if (typeof clientSideDataEncoded !== 'undefined') {
        return JSON.parse(atob(clientSideDataEncoded));
    }

    console.error('Could not retrieve clientSideData');
    return {};
}

export function getClientSideData(): ClientSideData {
    if (isServer()) {
        if (!getInertiaGlobalPage()) {
            throw new Error('Inertia global page not yet initialized');
        }

        return getInertiaGlobalPage()!.props.clientSideData as ClientSideData;
    }

    if (clientSideData === undefined) {
        clientSideData = calculateClientSideData();
    }

    return clientSideData;
}
