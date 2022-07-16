import express from "express";
import routes from "./routes.js";
import bodyParser from "body-parser";
import { handleError } from "./middlewares/middlewares.js";

const app = express();

app.use(bodyParser());
app.use(handleError);

app.use(routes);

export default app;
