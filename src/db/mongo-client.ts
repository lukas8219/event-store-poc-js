import { MongoClient } from "mongodb";

const Mongo = new MongoClient(
  `mongodb://root:example@mongo:27017/?maxPoolSize=20&w=majority`
);

export default Mongo;
