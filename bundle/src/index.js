"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_client_1 = require("@eventstore/db-client");
const eventstore_db_js_1 = require("./eventstore.db.js");
try {
    const event = (0, db_client_1.jsonEvent)({
        type: 'new-client',
        data: {
            name: 'Lucas'
        }
    });
    await eventstore_db_js_1.EventStore.appendToStream('client-1', event);
    await eventstore_db_js_1.EventStore.dispose();
}
catch (err) {
    console.error('An error occure when trying to append to stream', err);
}
