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
  nodes: RegisterNodeBody[];
};


export async function launchRegistry() {
  const nodes: RegisterNodeBody[] = [];


  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  _registry.get("/status", (req, res) => {
    res.send("live");
  });

  _registry.post("/registerNode", async (req, res) => {
    const {nodeId, pubKey} = req.body;     
    nodes.push({ nodeId: nodeId, pubKey: pubKey });  
    res.send("ok");
  });


  _registry.get("/getNodeRegistry", (req, res) => {
    res.send(JSON.stringify({ nodes }));

  });


  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
