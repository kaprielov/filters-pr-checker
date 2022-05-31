import { MessageType } from '../message';
export declare const sendAppMessage: (message: {
    type: MessageType;
    payload?: unknown;
}) => Promise<any>;
