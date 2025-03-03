import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());
  var lastReceivedMessage : any = null;
  var lastSentMessage : any = null;

  // TODO implement the status route
  // _user.get("/status", (req, res) => {});
  _user.get("/status", (req, res) => {
    res.send("live");
  });

    _user.get("/getLastReceivedMessage", (req, res) => {
      res.send(JSON.stringify({"result":lastReceivedMessage}));
    });
  
    _user.get("/getLastSentMessage", (req, res) => {
      res.send(JSON.stringify({"result":lastSentMessage}));
    })

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(
      `User ${userId} is listening on port ${BASE_USER_PORT + userId}`
    );
  });

  _user.post("/message", (req, res) => {
    const {message} = req.body;
    lastReceivedMessage = message;
    res.send("success");
  });

  return server;
}
