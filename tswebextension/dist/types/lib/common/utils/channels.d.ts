export declare type EventChannelListener<T> = (data: T) => void;
export declare type EventChannelDispatcher<T> = (data: T) => void;
export interface EventChannelInterface<T> {
    dispatch: EventChannelDispatcher<T>;
    subscribe: (listener: EventChannelListener<T>) => void;
    unsubscribe: (listener: EventChannelListener<T>) => void;
}
/**
 * Simple pub-sub implementation
 */
export declare class EventChannel<T> implements EventChannelInterface<T> {
    private listeners;
    dispatch(data: T): void;
    subscribe(listener: EventChannelListener<T>): void;
    unsubscribe(listener: EventChannelListener<T>): void;
}
