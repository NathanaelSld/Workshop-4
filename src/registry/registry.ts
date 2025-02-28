import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";

import {
  generateRsaKeyPair, 
  exportPubKey,
  exportPrvKey,
  
} from "../crypto";

export type Node = { 
  nodeId: number;
   pubKey: string;
   prvKey: string;
  };

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};

const nodes: Node[] = [];

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  // TODO implement the status route
  // _registry.get("/status", (req, res) => {});
  _registry.get("/status", (req, res) => {
    res.send("live");
  });

  _registry.post("/registerNode", async (req, res) => {
    const body: RegisterNodeBody = req.body;     
    const {publicKey, privateKey} = await generateRsaKeyPair();
    const pubKey = await exportPubKey(publicKey);
    const prvKey = await exportPrvKey(privateKey);
    if (pubKey && prvKey) {
      nodes.push({ nodeId: body.nodeId, pubKey: pubKey, prvKey: prvKey });
      console.log("registerNode", body);
      res.send("ok");
    } else {
      res.status(500).send("Failed to generate keys");
    }
  });


  //TODO : Create an HTTP GET route called /getPrivateKey that allows the unit tests to retrieve the private key of a node.
  _registry.get("/getPrivateKey", (req, res) => {
    const nodeId = req.body.nodeId;
    const node = nodes.find((node) => node.nodeId === nodeId);
    if (node) {

    }
    

  });

 //TODO : 
  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
