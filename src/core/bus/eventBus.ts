import { AppEvents } from './events';

type Listener<T> = (data: T) => void;

class EventBus {
  private listeners: { [key: string]: Listener<any>[] } = {};

  on<K extends keyof AppEvents>(event: K, listener: Listener<AppEvents[K]>): () => void {
    if (!this.listeners[event as string]) {
      this.listeners[event as string] = [];
    }
    this.listeners[event as string].push(listener);

    // Retorna función de desuscripción limpia
    return () => {
      this.listeners[event as string] = this.listeners[event as string].filter(l => l !== listener);
    };
  }

  emit<K extends keyof AppEvents>(event: K, data: AppEvents[K]): void {
    if (!this.listeners[event as string]) return;
    this.listeners[event as string].forEach(listener => listener(data));
  }
}

export const eventBus = new EventBus();
