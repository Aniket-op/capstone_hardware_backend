// backend.js
import express from "express";
import mqtt from "mqtt";

const app = express();
const PORT = 1883;

// Connect to MQTT broker
// Replace with your broker URL (local or cloud)
const brokerUrl = "mqtt://broker.hivemq.com"; 
const client = mqtt.connect(brokerUrl);

// Topic where IoT devices will publish
const topic = "iot/device/data";

// Variable to store last message
let lastMessage = null;

// MQTT connection
client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`📡 Subscribed to topic: ${topic}`);
    } else {
      console.error("❌ Subscription error:", err);
    }
  });
});

// Receive messages from IoT device
client.on("message", (topic, message) => {
  console.log(`📩 Message received on ${topic}: ${message.toString()}`);
  lastMessage = message.toString();
});

// Express route to get last received IoT data
app.get("/", (req, res) => {
  if (lastMessage) {
    res.json({ success: true, data: lastMessage });
  } else {
    res.json({ success: false, message: "No data received yet" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
