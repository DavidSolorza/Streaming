import type { BusEvents, BusEventKey, BusEventListener } from './busEvents.ts';

export class BusService {
  private static instance: BusService;
  private listeners: Map<string, Array<(data: any) => void | Promise<void>>> = new Map();
  private commandHandlers: Map<string, (payload: any) => Promise<any>> = new Map();

  static getInstance(): BusService {
    if (!this.instance) {
      this.instance = new BusService();
    }
    return this.instance;
  }

  registerCommandHandler<TInput, TOutput>(
    commandName: string,
    handler: (payload: TInput) => Promise<TOutput>
  ): void {
    if (this.commandHandlers.has(commandName)) {
      throw new Error(`Handler para comando "${commandName}" ya está registrado.`);
    }
    this.commandHandlers.set(commandName, handler);
  }

  async executeCommand<TInput, TOutput>(commandName: string, payload: TInput): Promise<TOutput> {
    const handler = this.commandHandlers.get(commandName);
    if (!handler) {
      throw new Error(`Comando "${commandName}" no cuenta con handler registrado.`);
    }
    return await handler(payload);
  }

  subscribe<K extends BusEventKey>(event: K, listener: BusEventListener<K>): () => void {
    const current = this.listeners.get(event) || [];
    current.push(listener as (data: any) => void | Promise<void>);
    this.listeners.set(event, current);

    return () => {
      const updated = (this.listeners.get(event) || []).filter((l) => l !== listener);
      this.listeners.set(event, updated);
    };
  }

  publish<K extends BusEventKey>(event: K, data: BusEvents[K]): void {
    const registered = this.listeners.get(event) || [];
    for (const listener of registered) {
      try {
        const res = listener(data);
        if (res instanceof Promise) {
          res.catch((err) => console.error(`[BusService] Error en listener asíncrono para ${event}:`, err));
        }
      } catch (err) {
        console.error(`[BusService] Error en listener síncrono para ${event}:`, err);
      }
    }
  }
}

export const busService = BusService.getInstance();
