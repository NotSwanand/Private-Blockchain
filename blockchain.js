// blockchain.js (full file for clarity)

const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      prevBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      console.error("❌ Invalid genesis block");
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, prevHash, hash, nonce, difficulty, data } = chain[i];
      const lastBlock = chain[i - 1];

      if (prevHash !== lastBlock.hash) return false;

      const validatedHash = cryptoHash(
        timestamp,
        prevHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== validatedHash) return false;

      if (Math.abs(lastBlock.difficulty - difficulty) > 1) return false;
    }
    return true;
  }

  // Simple cumulative work metric: sum of difficulties
  static totalWork(chain) {
    return chain.reduce((sum, b) => sum + (b.difficulty || 0), 0);
  }

  replaceChain(incomingChain) {
    if (!Blockchain.isValidChain(incomingChain)) {
      console.error("⚠️ Incoming chain is invalid");
      return;
    }

    const currentLen = this.chain.length;
    const incomingLen = incomingChain.length;

    const currentWork = Blockchain.totalWork(this.chain);
    const incomingWork = Blockchain.totalWork(incomingChain);

    // ✅ Replace if longer OR same length but higher cumulative work
    const isBetter =
      incomingLen > currentLen ||
      (incomingLen === currentLen && incomingWork > currentWork);

    if (!isBetter) {
      console.error("⚠️ Incoming chain is not better (length/work)");
      return;
    }

    console.log("🔁 Replacing chain with new chain");
    this.chain = incomingChain;
  }
}

module.exports = Blockchain;
