export enum ModalViewType {
    CLOSED = 'closed',
    MINIMIZED = 'minimized',
    CHAT = 'chat',
    DISCOVER = 'discover',
    NEW_CHAT = 'new chat',
    REGISTER = 'register',
}

export const CLOSED_VIEWS = new Set<ModalViewType>([
    ModalViewType.CLOSED,
    ModalViewType.MINIMIZED,
]);

export const OPEN_VIEWS = new Set<ModalViewType>([
    ModalViewType.CHAT,
    ModalViewType.DISCOVER,
    ModalViewType.NEW_CHAT,
    ModalViewType.REGISTER,
]);
