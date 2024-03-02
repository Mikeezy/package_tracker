import { Subject } from 'rxjs';

const subject = new Subject();

export enum MessageType {
    Connected,
    Disconnected,
    onDeliveryUpdate
}

export interface IMessageType {
    type: MessageType,
    payload: any
}

export const messageService = {
    sendMessage: (message: IMessageType) => subject.next(message),
    getMessage: () => subject.asObservable()
};
