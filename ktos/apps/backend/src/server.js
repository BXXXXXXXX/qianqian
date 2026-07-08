import http from "node:http";
import { createApp } from "./app.js";

const port = Number.parseInt(process.env.PORT ?? "8787", 10);
const server = http.createServer(createApp());

server.listen(port, () => {
  console.log(`KTOS backend listening on http://localhost:${port}`);
});
