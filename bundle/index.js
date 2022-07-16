import { jsonEvent } from "@eventstore/db-client";
import { EventStore } from "./eventstore.db.js";
try {
    const event = jsonEvent({
        type: "new-client",
        data: {
            name: "Lucas",
        },
    });
    await EventStore.appendToStream("client-1", event);
    await EventStore.dispose();
}
catch (err) {
    console.error("An error occure when trying to append to stream", err);
}
