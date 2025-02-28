import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT } from "../config";
import { on } from "events";

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  var lastReceivedEncryptedMessage : any=  null;
  var lastReceivedDecryptedMessage : any = null;
  var lastMessageDestination : any = null;
  var lastReceivedMessage : any = null;
  var lastSentMessage : any = null;

  // TODO implement the status route
  // onionRouter.get("/status", (req, res) => {});
  onionRouter.get("/status", (req, res) => {
    res.send("live");
  });

  // TODO implement the route to send a message
  onionRouter.get("/getLastReceivedEncryptedMessage", (req, res) => {
    res.send(JSON.stringify({"result":lastReceivedEncryptedMessage}));
  });

  onionRouter.get("/getLastReceivedDecryptedMessage", (req, res) => {
    res.send(JSON.stringify({"result":lastReceivedDecryptedMessage}));
  });

  onionRouter.get("/getLastMessageDestination", (req, res) => {
    res.send(JSON.stringify({"result":lastMessageDestination}));
  });

;

  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  return server;
}
