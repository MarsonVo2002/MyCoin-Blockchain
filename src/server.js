const express = require('express');
const { ec: EC } = require('elliptic');
const cors = require('cors');
const myCoin = require('../src/services/blockchain');
const fs = require('fs');
const app = express();
const port = 3000;
const ec = new EC('secp256k1');
let keyPairs = []; // Array to store key pairs with passwords
let transactions = loadTransactionsFromFile('transactions.json');
let blockchain;
const blockchainFilePath = 'blockchain.json';
if (fs.existsSync(blockchainFilePath)) {
  blockchain = myCoin.Blockchain.loadFromFile(blockchainFilePath)
} else {
  blockchain = new myCoin.Blockchain();
  saveBlockchain();
}
// Load transactions from JSON file
function loadTransactionsFromFile(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading transactions from file:', error);
    return [];
  }
}

// Append new transaction to the list
function addTransaction(transaction) {
  transactions.push(transaction);
}

// Save transactions to JSON file
function saveTransactionsToFile(filename) {
  try {
    const json = JSON.stringify(transactions, null, 2);
    fs.writeFileSync(filename, json);
    console.log('Transactions saved to file');
  } catch (error) {
    console.error('Error saving transactions to file:', error);
  }
}

// Check if keyPairs.json file exists, and load the data if it does
if (fs.existsSync('keyPairs.json')) {
  const data = fs.readFileSync('keyPairs.json');
  keyPairs = JSON.parse(data);
}
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/blockchain-data', (req, res) => {
  // Read blockchain data from JSON file
  fs.readFile(blockchainFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading blockchain data:', err);
          res.status(500).send('Error reading blockchain data');
          return;
      }
      res.json(JSON.parse(data));
  });
});
// Endpoint to read the JSON data and send it to the client
app.get('/data', (req, res) => {
  fs.readFile('transactions.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    res.json(JSON.parse(data));
  });
});
app.post('/balance', async (req, res) => {
  try {
    console.log(req.body)
    // Retrieve data from request body
    const { publicKey } = req.body;
    const balance = blockchain.getBalanceOfAddress(publicKey);
    // Handle response (e.g., send transaction hash back to the client)
    res.json({ balance: balance });
  } catch (error) {
    console.error('Error sending balance:', error);
    res.status(500).json({ error: 'Error sending coins' });
  }
})
app.post('/send-coins', async (req, res) => {
  try {
    console.log(req.body)
    // Retrieve data from request body
    const { fromAddress, toAddress, amount, privateKey } = req.body;

    // Sign the transaction
    const tx = {
      fromAddress: fromAddress,
      toAddress: toAddress,
      amount: amount,
      privateKey: privateKey
    }
    // Send the transaction to the network
    // Assuming this method sends the signed transaction to the network
    addTransaction(tx);

    // Save the transactions to file
    saveTransactionsToFile('transactions.json');
    // Handle response (e.g., send transaction hash back to the client)
    res.json({ transactionHash: tx });
  } catch (error) {
    console.error('Error sending coins:', error);
    res.status(500).json({ error: 'Error sending coins' });
  }
});
app.post('/process-transaction', (req, res) => {
  try {
    const { fromAddress, toAddress, amount, miningRewardAddress, myKey } = req.body;
    const tx = {
      fromAddress: fromAddress,
      toAddress: toAddress,
      amount: amount,
      privateKey: myKey
    }
    const key = ec.keyFromPrivate(myKey);
    if (fromAddress === key.getPublic('hex')) {
      console.log('equal');
    }
    const transaction = new myCoin.Transaction(fromAddress, toAddress, amount);
    console.log("create ok")
    transaction.signTransaction(key);
    console.log("sign ok")
    blockchain.addTransaction(transaction);
    console.log("add ok")
    blockchain.minePendingTransactions(miningRewardAddress);
    console.log(blockchain.getBalanceOfAddress(miningRewardAddress))
    saveBlockchain();
    res.json({ success: true });
    transactions = transactions.filter(function (trans) {
      return (
        trans.fromAddress !== tx.fromAddress ||
        trans.toAddress !== tx.toAddress ||
        trans.amount !== tx.amount ||
        trans.privateKey !== tx.privateKey
      );;
    })
    console.log(transactions)
    console.log(tx)
    saveTransactionsToFile('transactions.json');
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Route for generating and downloading key pair as JSON
app.post('/generate-keys/json', (req, res) => {
  // Generate key pair
  const password = req.body ? req.body.password : null; // Check if req.body is defined
  console.log(req.body.password)
  // Ensure password is provided
  if (!password) {
    return res.status(400).send('Password is required');
  }
  const keyPair = ec.genKeyPair();

  // Convert keys to string format
  const privateKey = keyPair.getPrivate('hex');
  const publicKey = keyPair.getPublic('hex');

  // Create JSON object
  const keyData = {
    privateKey: privateKey,
    publicKey: publicKey,
    password: password
  };
  keyPairs.push(keyData);
  // Save key pairs to JSON file
  saveKeyPairsToFile();
  // Send JSON data as response
  res.setHeader('Content-disposition', 'attachment; filename=keyPair.json');
  res.setHeader('Content-type', 'application/json');
  res.send(JSON.stringify(keyData, null, 4));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
function saveKeyPairsToFile() {
  const data = JSON.stringify(keyPairs, null, 4);
  fs.writeFileSync('keyPairs.json', data);
}
function saveBlockchain() {
  const blockchainData = JSON.stringify(blockchain);
  fs.writeFileSync(blockchainFilePath, blockchainData);
}