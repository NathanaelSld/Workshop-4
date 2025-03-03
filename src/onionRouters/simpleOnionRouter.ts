import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT } from "../config";
import { on } from "events";
import { generateRsaKeyPair, exportPubKey, exportPrvKey } from "../crypto";

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  var lastReceivedEncryptedMessage : any =  null;
  var lastReceivedDecryptedMessage : any = null;
  var lastMessageDestination : any = null;
  var lastReceivedMessage : any = null;
  var lastSentMessage : any = null;

  const {publicKey, privateKey} = await generateRsaKeyPair();
  const pubKeyBase64 = await exportPubKey(publicKey);
  const prvKeyBase64 = await exportPrvKey(privateKey);

  fetch("http://localhost:8080/registerNode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nodeId: nodeId, pubKey:pubKeyBase64 }),
  });

  onionRouter.get("/status", (req, res) => {
    res.send("live");
  });

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
  onionRouter.get("/getPrivateKey", (req, res) => {
    res.send(JSON.stringify({"result":prvKeyBase64}));
  });

  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  return server;
}
