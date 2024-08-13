const net = require("net");
const fs = require("fs");

const HOST = "127.0.0.1";
const PORT = 3000;

let receivedPackets = [];

const client = new net.Socket();
client.connect(PORT, HOST, () => {
  console.log("Connected to BetaCrew exchange server");
  let requestBuffer = Buffer.alloc(2);
  requestBuffer.writeUInt8(1, 0);
  requestBuffer.writeUInt8(0, 1);
  client.write(requestBuffer);
});

client.on("data", (data) => {
  const PACKET_SIZE = 17;

  while (data.length >= PACKET_SIZE) {
    const symbol = data.toString("ascii", 0, 4);
    const buySellIndicator = data.toString("ascii", 4, 5);
    const quantity = data.readInt32BE(5);
    const price = data.readInt32BE(9);
    const packetSequence = data.readInt32BE(13);

    receivedPackets.push({
      symbol,
      buySellIndicator,
      quantity,
      price,
      packetSequence,
    });

    data = data.slice(PACKET_SIZE);
  }
});

client.on("close", () => {
  console.log("Connection closed");

  receivedPackets.sort((a, b) => a.packetSequence - b.packetSequence);

  const lastSequence =
    receivedPackets[receivedPackets.length - 1].packetSequence;
  for (let i = 1; i <= lastSequence; i++) {
    if (!receivedPackets.some((packet) => packet.packetSequence === i)) {
      requestMissingPacket(i);
    }
  }

  fs.writeFileSync("output.json", JSON.stringify(receivedPackets, null, 2));
  console.log("Data saved to output.json");
});

client.on("error", (err) => {
  console.error("Error: ", err);
});

function requestMissingPacket(sequence) {
  const clientForResend = new net.Socket();
  clientForResend.connect(PORT, HOST, () => {
    console.log(`Requesting missing packet: ${sequence}`);
    let requestBuffer = Buffer.alloc(2);
    requestBuffer.writeUInt8(2, 0);
    requestBuffer.writeUInt8(sequence, 1);
    clientForResend.write(requestBuffer);
  });

  clientForResend.on("data", (data) => {
    const symbol = data.toString("ascii", 0, 4);
    const buySellIndicator = data.toString("ascii", 4, 5);
    const quantity = data.readInt32BE(5);
    const price = data.readInt32BE(9);
    const packetSequence = data.readInt32BE(13);

    receivedPackets.push({
      symbol,
      buySellIndicator,
      quantity,
      price,
      packetSequence,
    });

    clientForResend.destroy();
  });

  clientForResend.on("close", () => {
    console.log(`Received missing packet: ${sequence}`);
  });

  clientForResend.on("error", (err) => {
    console.error("Error: ", err);
  });
}
