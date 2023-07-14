const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { sha256 } = require("ethereum-cryptography/sha256");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0273b3489a4b3fbdea9c1d364e78838c5118ded287a1062b771c7b7ec91017f3dc": 100, // baye
  "0387492dddf9c293b11ec9b8dc58476154a318cb208e4fa5c6d3f45675477690a0": 50, // joe
  "025af53cc94c1c8280d03a372258e801e0bb13d6d44a0c8b217efd3a896e766e99": 75, // macy
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  if (!isTransactionValid(sender, recipient, amount, signature)) {
    res.status(403).send({ message: "Forbidden!" });
    return -1;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function isTransactionValid(sender, recipient, amount, signature) {
  const txnHash = sha256(utf8ToBytes(`${sender + recipient + amount}`));

  return secp256k1.verify(signature, txnHash, sender);
}
