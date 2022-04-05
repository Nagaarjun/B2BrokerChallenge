"use strict";
// const CustomClient = require("./client");
const serverPort = 3000,
    http = require("http"),
    express = require("express"),
    app = express(),
    server = http.createServer(app),
    WebSocket = require("ws"),
    websocketServer = new WebSocket.Server({ server });

const customClients = new Map();

class CustomClient {
    constructor() {
        this._interval = undefined;
    }

    subscribe(client) {
        client.send(` { "type": "Subscribed" }`);
        this._interval = setInterval(() => { client.send(`{ "type": "heartbeat", "date":${new Date().toISOString()} }`); }, 1000);
    }

    unSubscribe() {
        clearInterval(this._interval);
    }
}


//when a websocket connection is established
websocketServer.on('connection', (webSocketClient) => {
    //send feedback to the incoming connection
    webSocketClient.send('{ "connection" : "ok"}');
    //when a message is received
    webSocketClient.on('message', (message) => {
        console.log("The message received:", message.toString());

        let customClient;
        if (customClients.get(webSocketClient)) {
            console.log("Object present");
            customClient = customClients.get(webSocketClient);
        } else {
            console.log("Object not present");
            customClient = new CustomClient();
            customClients.set(webSocketClient, customClient);
        }

        if (message.toString() === "subscribe") {
            setTimeout(() => customClient.subscribe(webSocketClient), 4000);
        } else {
            setTimeout(() => {
                webSocketClient.send(` { "type": "Un subscribed" } `);
                customClient.unSubscribe(webSocketClient);
            }, 8000
            );
        }
    });
});

//start the web server
server.listen(serverPort, () => {
    console.log(`Websocket server started on port ` + serverPort);
});