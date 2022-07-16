"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStore = void 0;
const db_client_1 = require("@eventstore/db-client");
const EventStore = new db_client_1.EventStoreDBClient({
    endpoint: 'esdb-node1:2113',
}, {
    insecure: true
});
exports.EventStore = EventStore;
