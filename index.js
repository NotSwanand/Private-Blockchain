const bodyParser = require("body-parser");
const express = require("express");
const Blockchain = require("./blockchain");
const PubSub = require("./publishsubscribe");
const request = require("request");
const { port } = require("./config");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

// ✅ Use Render's dynamic port or fallback to 3000
const DEFAULT_PORT = process.env.PORT || port || 3000;

// ✅ Use a PUBLIC ROOT_NODE_ADDRESS if provided (for peers on Render)
const ROOT_NODE_ADDRESS =
  process.env.ROOT_NODE_ADDRESS || `http://localhost:${DEFAULT_PORT}`;

// ✅ Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// -------------------- Routes --------------------
app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  console.log("⛏️  New block mined and broadcasted");
  res.redirect("/api/blocks");
});

// -------------------- Sync Chains --------------------
const syncChains = () => {
  // Don’t sync from yourself
  if (ROOT_NODE_ADDRESS.includes(`localhost:${DEFAULT_PORT}`)) {
    console.log("🟡 Skipping sync — this is the root node");
    return;
  }

  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);
      console.log("🔄 Syncing chain with root node...");
      blockchain.replaceChain(rootChain);
    } else {
      console.error("❌ Sync failed:", error || response.statusCode);
    }
  });
};

// -------------------- Dynamic Port Setup --------------------
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`✅ Listening on port ${PORT}`);

  // 🔹 Try syncing on startup (only if not root)
  syncChains();

  // 🔹 Broadcast initial chain after startup
  setTimeout(() => pubsub.broadcastChain(), 1000);
});
