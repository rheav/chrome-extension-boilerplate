type MessageType = 'GET_PAGE_TITLE' | 'CONTENT_SCRIPT_LOADED' | 'ANALYZE_PAGE' | 'UPDATE_BADGE' | 'CLEAR_DATA';

type MessagePayload = {
  GET_PAGE_TITLE: { tabId: number };
  CONTENT_SCRIPT_LOADED: { tabId: number };
  ANALYZE_PAGE: { url: string; data: unknown };
  UPDATE_BADGE: { text: string };
  CLEAR_DATA: undefined;
}

type MessageResponse = {
  GET_PAGE_TITLE: { title: string };
  CONTENT_SCRIPT_LOADED: void;
  ANALYZE_PAGE: { success: boolean };
  UPDATE_BADGE: void;
  CLEAR_DATA: void;
}

export type Message<T extends MessageType = MessageType> = {
  type: T;
  payload: T extends keyof MessagePayload ? MessagePayload[T] : undefined;
}

// Type-safe message sending
export async function sendMessage<T extends MessageType>(
  message: Message<T>
): Promise<T extends keyof MessageResponse ? MessageResponse[T] : void> {
  try {
    return await chrome.runtime.sendMessage(message);
  } catch (error) {
    console.error('Message sending failed:', error);
    throw error;
  }
}

// Type-safe message handling
export function createMessageHandler(
  handlers: {
    [T in MessageType]?: (
      payload: T extends keyof MessagePayload ? MessagePayload[T] : undefined
    ) => Promise<T extends keyof MessageResponse ? MessageResponse[T] : void>;
  }
) {
  return async function messageHandler<T extends MessageType>(
    message: Message<T>,
    _sender: chrome.runtime.MessageSender
  ): Promise<T extends keyof MessageResponse ? MessageResponse[T] : void> {
    const handler = handlers[message.type] as (
      payload: T extends keyof MessagePayload ? MessagePayload[T] : undefined
    ) => Promise<T extends keyof MessageResponse ? MessageResponse[T] : void>;

    if (!handler) {
      console.warn(`No handler for message type: ${message.type}`);
      return Promise.resolve(undefined) as Promise<T extends keyof MessageResponse ? MessageResponse[T] : void>;
    }

    try {
      const response = await handler(message.payload);
      return response;
    } catch (error) {
      console.error(`Error handling message ${message.type}:`, error);
      throw error;
    }
  };
}
