import { createServer } from "node:http";
import { loadConfig } from "./src/config/env.js";
import { createDatabase } from "./src/config/database.js";
import { createRequestHandler } from "./src/http/request-handler.js";

const config = loadConfig();
const database = createDatabase(config.dbPath);

const server = createServer(createRequestHandler(database, config));
server.listen(config.port);

export { server };