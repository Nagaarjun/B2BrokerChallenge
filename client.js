class CustomClient {
    constructor(message) {
        this.message = message;
    }

    subscribe() {
        setInterval(() => { client.send(`subscribed`); }, 4000)
    }

    unsubscribe() {
        setInterval(() => { client.send(`unsubscribed`); }, 8000)
    }

}