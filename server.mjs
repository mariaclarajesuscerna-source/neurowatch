import { createServer } from "node:https";
import { readFileSync } from "node:fs";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync("./certificates/localhost-key.pem"),
  cert: readFileSync("./certificates/localhost.pem"),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log("Neurowatch HTTPS listo en:");
    console.log("  https://localhost:3000");
    console.log("  https://192.168.0.222:3000");
  });
});
