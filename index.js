const bodyParser = require("body-parser");
const express = require("express");
const Blockchain = require("./blockchain");
const PubSub = require("./publishsubscribe");
const request = require("request");
const { port } = require("./config");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

// ✅ Use Render's dynamic port (important!)
const DEFAULT_PORT = process.env.PORT || port || 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());
app.use(express.static(__dirname));
// ---------------- Routes ----------------
app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect("/api/blocks");
});

// -------------- Sync Chains --------------
const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);
      console.log("Replacing chain on sync with", rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
};

// -------------- Dynamic Port --------------
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;

// -------------- Start Server --------------
app.listen(PORT, () => {
  console.log(`✅ Listening on port ${PORT}`);
  if (PORT !== DEFAULT_PORT) syncChains();
  setTimeout(() => pubsub.broadcastChain(), 1000);
});
