import { EventBus } from "@vmw/transport";

declare global {
  interface Window {
    transport?: any;
  }
}
export class BridgeSDK {
  bus: EventBus;
  widgetID: string;

  private constructor(widgetID: string, bus: EventBus) {
    this.widgetID = widgetID;
    this.bus = bus;
  }

  static async init(widgetID: string) {
    console.log("init called");
    if (typeof window === "undefined" || !window) {
      console.log("client window", window);
      throw new Error("You tried to import client-only code on the server.");
    }
    await import("./scripts/transport.umd.min.js");
    if (!window.transport) throw new Error("Tranport bus not yet initiated");

    const { TransportEventBus } = window.transport;
    TransportEventBus.boot();

    const bus = TransportEventBus.getInstance();

    bus.enableMessageProxy({
      protectedChannels: ["widget-rome"],
      proxyType: "child", // runs as child.
      parentOrigin: `http://localhost:3000/`,
      acceptedOrigins: [
        "http://localhost:3000", // local dev
      ], // production
      targetAllFrames: true,
      targetSpecificFrames: [],
    });
    return new BridgeSDK(widgetID, bus);
  }

  startRespondStream({ messageHandlers }: Stream): void {
    this.bus
      .respondStream("widget-rome", undefined, this.widgetID)
      .generate((request: Event) => {
        if (!messageHandlers) return;
        const handler = messageHandlers.find(
          (messageHandler) => request.type === messageHandler.event.type
        );
        if (!handler || !handler.handler) return;
        return handler.handler(request);
      });
  }
  // waits for messages from parent terminal and acts on the message
  startListenStream({ messageHandlers }: Stream): void {
    this.bus
      .listenStream("widget-rome", undefined, this.widgetID)
      .handle((request: Event) => {
        if (!messageHandlers) return;
        const handler = messageHandlers.find(
          (messageHandler) => request.type === messageHandler.event.type
        );
        if (!handler || !handler.handler) return;
        handler.handler(request);
      });
  }

  // sends message to the parent terminal
  sendMessage({ message }: Message): void {
    this.bus.requestOnceWithId(this.widgetID, "widget-rome", message);
  }

  // sends a request to the parent terminal expecting a response
  sendRequest({ request, responseHandler }: Request): void {
    this.bus
      .requestOnceWithId(this.widgetID, "widget-rome", request)
      .handle((response: boolean) => {
        responseHandler(response);
      });
  }
}

export interface MessageHandler {
  event: Event;
  handler?: (event: Event) => any;
}
export interface Stream {
  messageHandlers?: MessageHandler[];
}
export interface Request {
  request: Event;
  responseHandler: (success: boolean) => any;
}

export interface Message {
  message: Event;
}

export type Bus = EventBus;

type WidgetType = `${"EVENT_"}${string}`;
type MessageType = `${"MESSAGE_"}${string}`;
type RequestType = `${"REQUEST_"}${string}`;

export type Type =
  | "EVENT_ROME_WIDGET_CLOSE"
  | "EVENT_ROME_WIDGET_ENLARGE"
  | WidgetType
  | MessageType
  | RequestType;

export interface Event {
  type: Type;
  timestamp?: number;
  broadcast?: boolean;
  payload?: any;
}
