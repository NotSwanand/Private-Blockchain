const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;

    // Explicitly specify Redis URL (works with WSL or local Redis)
    this.publisher = redis.createClient({ url: "redis://127.0.0.1:6379" });
    this.subscriber = redis.createClient({ url: "redis://127.0.0.1:6379" });

    this.init();
  }

  async init() {
    try {
      // Connect both clients
      await this.publisher.connect();
      await this.subscriber.connect();
      console.log("✅ Redis publisher & subscriber connected");

      // Subscribe to channels
      await this.subscriber.subscribe(CHANNELS.TEST, (message) =>
        this.handleMessage(CHANNELS.TEST, message)
      );
      await this.subscriber.subscribe(CHANNELS.BLOCKCHAIN, (message) =>
        this.handleMessage(CHANNELS.BLOCKCHAIN, message)
      );

    } catch (err) {
      console.error("❌ Redis connection error:", err);
    }
  }

  handleMessage(channel, message) {
    console.log(`📩 Message Received. Channel: ${channel} | Message: ${message}`);

    const parsedMessage = JSON.parse(message);
    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage);
    }
  }

  async publish({ channel, message }) {
    try {
      await this.publisher.publish(channel, message);
      console.log(`📤 Published message to channel: ${channel}`);
    } catch (err) {
      console.error("❌ Publish error:", err);
    }
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

module.exports = PubSub;
