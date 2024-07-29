import { EventEmitter } from "events";
import { creditsUsedHandler, songGeneratedHandler } from "./handlers";
import { EventTypes, QueueEvent } from "./events";

export type QueueEventHandler<TPayload> = (payload: TPayload) => void;

export default class Queue {
  private static instance: Queue;
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
  }

  public static getInstance(): Queue {
    if (!Queue.instance) {
      Queue.instance = new Queue();
    }

    return Queue.instance;
  }

  public on<TPayload>(type: EventTypes, handler: QueueEventHandler<TPayload>): void {
    this.emitter.on(type, (payload: TPayload) => {
      handler(payload);
    });
  }

  public emit<TPayload>(event: QueueEvent<TPayload>): void {    
    this.emitter.emit(event.type, event.payload);
  }
}

let processing = Promise.resolve();
export const oneByOne = <TPayload,>(handler: QueueEventHandler<TPayload>) => {
  return (payload: TPayload) => {
    processing = processing.then(async () => {
      handler(payload);
    });
  };
}

const queue = Queue.getInstance();
queue.on(EventTypes.SongsGenerated, oneByOne(songGeneratedHandler));
queue.on(EventTypes.CreditsUsed, oneByOne(creditsUsedHandler));

export const instance = queue;



