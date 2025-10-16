const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    // Initialize with a constant genesis block
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
    // ✅ Ensure first block (genesis) is identical across all nodes
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      console.error("❌ Invalid Genesis Block");
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, prevHash, hash, nonce, difficulty, data } = chain[i];
      const lastBlock = chain[i - 1];

      // ✅ Check if the current block correctly references the previous one
      if (prevHash !== lastBlock.hash) return false;

      // ✅ Validate hash correctness
      const validatedHash = cryptoHash(
        timestamp,
        prevHash,
        data,
        nonce,
        difficulty
      );

      if (hash !== validatedHash) return false;

      // ✅ Check difficulty jump
      if (Math.abs(lastBlock.difficulty - difficulty) > 1) return false;
    }

    return true;
  }

  replaceChain(chain) {
    // ✅ Accept only a longer and valid chain
    if (chain.length <= this.chain.length) {
      console.error("⚠️ Incoming chain is not longer");
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("⚠️ Incoming chain is invalid");
      return;
    }

    console.log("🔁 Replacing chain with new chain");
    this.chain = chain;
  }
}

module.exports = Blockchain;
