// // script.js

// document.getElementById("generateJsonButton").addEventListener("click", function() {
//     downloadFile('http://localhost:3000/generate-keys/json', 'keyPair.json');
// });

// document.getElementById("generateTxtButton").addEventListener("click", function() {
//     downloadFile('http://localhost:3000/generate-keys/txt', 'keyPair.txt');
// });

// function downloadFile(url, name) {
//     // Send GET request to server
//     fetch(url)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Network response was not ok");
//             }
//             return response.blob();
//         })
//         .then(blob => {
//             // Create a link element to trigger the download
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.style.display = "none";
//             a.href = url;
//             console.log(url.endsWith('/json'))
//             a.download = name;
//             document.body.appendChild(a);
//             a.click();
//             window.URL.revokeObjectURL(url);
//         })
//         .catch(error => {
//             console.error("There was a problem with the fetch operation:", error);
//         });
// }
const transactions = [
    {
      fromAddress: '0415466146bbda4ae17aea43ab43cbe08100ca35f2c89f23c78bfe1a571be57bd8294e7e3403ea438232e728735292c521bb0985663c141a18ab2416f659069d62',
      toAddress: '044985bf173e961dc65ddbe12540dcbd6a48bd4af1d4cf3df9b1d3da302a6c365343d2721d4a865f6d7b01471b170eba9518ebc72acefda822a3fc828a98353ee0',
      amount: '8',
      privateKey: '1a0d4aa018ad7e9057ff3b511ae53db5bd7d3d1958d43365613b10beab54cb2c'
    }
  ];
  
  // Item to remove from the list
  const itemToRemove = {
    fromAddress: '0415466146bbda4ae17aea43ab43cbe08100ca35f2c89f23c78bfe1a571be57bd8294e7e3403ea438232e728735292c521bb0985663c141a18ab2416f659069d62',
    toAddress: '044985bf173e961dc65ddbe12540dcbd6a48bd4af1d4cf3df9b1d3da302a6c365343d2721d4a865f6d7b01471b170eba9518ebc72acefda822a3fc828a98353ee0',
    amount: '8',
    privateKey: '1a0d4aa018ad7e9057ff3b511ae53db5bd7d3d1958d43365613b10beab54cb2c'
  };
  
  // Filter out the item to remove from the list
  const updatedTransactions = transactions.filter(transaction => {
    return (
      transaction.fromAddress !== itemToRemove.fromAddress ||
      transaction.toAddress !== itemToRemove.toAddress ||
      transaction.amount !== itemToRemove.amount ||
      transaction.privateKey !== itemToRemove.privateKey
    );
  });
  
  console.log(updatedTransactions);