import { EventStoreDBClient } from "@eventstore/db-client";
const EventStore = new EventStoreDBClient({
    endpoint: 'esdb-node1:2113',
}, {
    insecure: true
});
export { EventStore };
