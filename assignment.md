## Assignment

1. Write a basic `WebSocket` server (using the [`ws`](https://www.npmjs.com/package/ws`) module) that does the following:

- Sends a heartbeat message every second

```json
{
  "type": "heartbeat",
  "date": "<Current date/time using ISO format>"
}
```

- Replies with a `subscribed` message (with a 4 seconds delay)

```json
{
  "type": "subscribed"
}
```

when a client sends a `subscribe` message

```json
{
  "type": "subscribe"
}
```

- Replies with a `unsubscribed` message (with a 8 seconds delay)

```json
{
  "type": "unsubscribed"
}
```

when a client sends a `unsubscribe` message

```json
{
  "type": "unsubscribe"
}
```

- Sends an error message

```json
{
  "type": "error"
}
```

when a client sends all other messages.

2. Write a client for the server created in the `1`

```typescript
abstract class CustomWebSocketClient {
  // Return a promise that resolves when a `subscribed` message is received and rejects if an error message is received
  abstract async subscribe();
  // Return a promise that resolves when an `unsubscribed` message is received and rejects if an error message is received
  abstract async unsubscribe();
}
```

3. (Extra) What other modifications(improvements) you could suggest?
