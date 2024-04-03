const {Blockchain, Transaction} = require("./blockchain")
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const myKey = ec.keyFromPrivate('55770bf9cfbbad57bc316ebf4a1c94272adac0f9a815d72ba6df3df840d78903');
const myWalletAddress = myKey.getPublic('hex');
let myCoin = new Blockchain()
const tx1 = new Transaction(myWalletAddress,'public key goes here', 10);
tx1.signTransaction(myKey);
myCoin.addTransaction(tx1);
console.log('\nStarting mining');
myCoin.minePendingTransactions(myWalletAddress);
console.log('\nBalance of miner is', myCoin.getBalanceOfAddress(myWalletAddress));
myCoin.chain[1].transactions[0].amount = 1;
console.log('Is chain valid ? ' + myCoin.isChainValid());
