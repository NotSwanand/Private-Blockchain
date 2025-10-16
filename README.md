# 🪙 Private Blockchain Network (Render + Upstash)

A simple **private blockchain network** hosted on **Render** with multi-node synchronization powered by **Upstash Redis (Pub/Sub)**.

Each node maintains its own blockchain instance and automatically synchronizes blocks across the network — demonstrating **decentralized data consistency** in a minimal setup.

---

## 🚀 Live Demo

| Service | URL | Description |
|----------|-----|-------------|
| 🟢 Root Node | [https://private-blockchain.onrender.com](https://private-blockchain.onrender.com) | Primary blockchain node (mining allowed) |
| 🟠 Peer Node | [https://private-blockchain-node2.onrender.com](https://private-blockchain-node2.onrender.com) | Secondary node syncing via Upstash Redis |

> ⛏️ Try mining on the root node’s `/api/mine` endpoint or UI — the peer node will automatically update its chain in real-time.

---

## 🧠 Project Overview

This project demonstrates a **cloud-hosted private blockchain network** with multiple connected nodes that:
- Maintain independent blockchains.
- Sync their chains using Redis Publish/Subscribe.
- Validate blocks and maintain consensus.
- Run on Render’s free cloud infrastructure.

It simulates the **distributed consensus** concept of real blockchain systems like Bitcoin and Ethereum — in a simplified educational setup.

---

## 🧩 Architecture Diagram

          ┌──────────────────────────┐
          │   🟢 Root Node (Render)   │
          │  private-blockchain.onrender.com
          │  - Mines new blocks
          │  - Publishes updates
          └────────────┬─────────────┘
                       │  Pub/Sub (BLOCKCHAIN)
                       ▼
          ┌──────────────────────────┐
          │   🟠 Peer Node (Render)   │
          │  private-blockchain-node2.onrender.com
          │  - Subscribes to updates
          │  - Syncs blockchain
          └────────────┬─────────────┘
                       │
                🔗 Upstash Redis Cloud
           (Secure rediss:// connection)

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Backend** | Node.js, Express.js |
| **Blockchain** | Custom proof-of-work chain (difficulty, nonce, hashes) |
| **Communication** | Redis Pub/Sub via [Upstash](https://upstash.com/) |
| **Hosting** | [Render](https://render.com/) free tier |
| **Database** | Redis (no SQL DB needed) |

---

## ⚙️ Installation (Local Setup)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/NotSwanand/Private-Blockchain.git
cd Private-Blockchain
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Start a local Redis instance (optional)

If you have Redis installed locally:
```bash
redis-server
```

Or use your Upstash Redis connection:
```bash
set REDIS_URL=rediss://default:YOUR_UPSTASH_KEY@YOUR_HOST.upstash.io:6379
```
### 4️⃣ Run the blockchain node
```bash
npm start
```

Visit http://localhost:3000/api/blocks

### 🌐 Cloud Deployment (Render Setup)

🟢 Root Node
| Key                 | Value                                 |
| ------------------- | ------------------------------------- |
| `REDIS_URL`         | `rediss://default:<YOUR_UPSTASH_URL>` |
| `ROOT_NODE_ADDRESS` | *(leave empty)*                       |

🟠 Peer Node(s)
| Key                 | Value                                     |
| ------------------- | ----------------------------------------- |
| `REDIS_URL`         | same Upstash Redis URL                    |
| `ROOT_NODE_ADDRESS` | `https://private-blockchain.onrender.com` |

🧩 API Endpoints
| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| `GET`  | `/api/blocks` | View full blockchain      |
| `POST` | `/api/mine`   | Add a new block with data |

### 🧩 Consensus Rules

- A block is mined via Proof-of-Work:
- Hash starts with a specific number of leading zeros (difficulty).
- When receiving a chain from peers:
- Only a longer and valid chain replaces the local one.
- Each node verifies:
- Correct hash link.
- Valid proof of work.
- Valid genesis block.

### 💡 Key Learnings

Setting up blockchain consensus logic.
Using Redis Pub/Sub for decentralized data sync.
Handling environment-based cloud configuration.
Deploying distributed services on free-tier Render.

### 👨‍💻 Author

Swanand Bowalekar
📍 Computer Engineering Student
📫 GitHub: @NotSwanand

⭐ If you found this helpful

Give this repo a star 🌟 on GitHub — it helps a ton!

✅ License

This project is open-source under the MIT License.
