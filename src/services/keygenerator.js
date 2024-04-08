const EC = require('elliptic').ec
const ec = new EC('secp256k1');
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');
var data =
{
    "PrivateKey": privateKey,
    "PublicKey": publicKey,
}
var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
var downloadAnchorNode = document.createElement('a');
downloadAnchorNode.setAttribute("href", dataStr);
downloadAnchorNode.setAttribute("download", 'key' + ".json");
document.body.appendChild(downloadAnchorNode); // required for firefox
downloadAnchorNode.click();
downloadAnchorNode.remove(); 
