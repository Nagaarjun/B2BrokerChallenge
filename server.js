"use strict";
// const CustomClient = require("./client");
const serverPort = 3000,
    http = require("http"),
    express = require("express"),
    app = express(),
    server = http.createServer(app),
    WebSocket = require("ws"),
    websocketServer = new WebSocket.Server({ server });

class CustomClient {
    constructor(message) {
        this._message = message;
    }

    async subscribe(client) {
        if (this._message === "subscribe") {
            await setInterval(() => { client.send(`subscribed`); }, 4000)
        }
    }

    async unsubscribe(client) {
        if (this._message === "unsubscribe") {
            await setInterval(() => { client.send(`unsubscribed`); }, 8000)
        }
    }

    get message() {
        return this._message;
    }

    set message(message) {
        this._message = message;
    }

}

let customClient = new CustomClient();

// Object.seal(customClient);



//when a websocket connection is established
websocketServer.on('connection', (webSocketClient) => {
    //send feedback to the incoming connection
    webSocketClient.send('{ "connection" : "ok"}');
    //when a message is received
    webSocketClient.on('message', (message) => {
        if (message.toString() === "subscribe" || message.toString() === "unsubscribe") {
            customClient.message = message.toString();
        }

        //for each websocket client
        websocketServer
            .clients
            .forEach(async (client) => {
                console.log(message.toString());
                if (message.toString() === "subscribe") { await customClient.subscribe(client); }
                else if (message.toString() === "unsubscribe") { await customClient.unsubscribe(client); }
                else { await client.send(`{"type": "error"}`); }
                if (customClient.message === "subscribe") {
                    await setInterval(() => { client.send(`{ "message" : "heartBeat", "date":${new Date().toISOString()} }`); }, 1000);
                }
            });
    });
});

//start the web server
server.listen(serverPort, () => {
    console.log(`Websocket server started on port ` + serverPort);
});