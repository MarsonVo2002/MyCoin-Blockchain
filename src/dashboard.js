const publicKey = sessionStorage.getItem("publicKey");
const privateKey = sessionStorage.getItem("privateKey");
let toAddress = document.getElementById("toAddress");
let amount = document.getElementById("amount");
document.getElementById("fromAddress").value = publicKey;
document.getElementById("account-address").value = publicKey;
const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
})
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    // Show the selected section
    document.getElementById(sectionId).classList.remove('hidden');
}
function addTableRow(tableBody, rowData) {
    const row = document.createElement('tr');
    for (const key in rowData) {
        const cell = document.createElement('td');
        cell.textContent = rowData[key];
        row.appendChild(cell);
    }
    tableBody.appendChild(row);
}

// Fetch blockchain data from the server
fetch('http://localhost:3000/blockchain-data')
    .then(response => response.json())
    .then(data => {
        const blockchainBody = document.getElementById('blockchain-body');
        data.chain.forEach(block => {
            addTableRow(blockchainBody, {
                Timestamp: new Date(block.timestamp).toLocaleString(),
                'Previous Hash': block.previousHash,
                Hash: block.hash
            });
        });
    })
    .catch(error => console.error('Error fetching blockchain data:', error));
document.getElementById('balance').addEventListener('click', async () => {
    try {
        // Send transaction request to the server
        const response = await fetch('http://localhost:3000/balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                publicKey: publicKey,
            })
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Balance:', responseData.balance);
            document.getElementById("balance-display").value = responseData.balance
        } else {
            throw new Error('Failed to send transaction');
        }
    } catch (error) {
        console.error('Error sending transaction:', error);
        alert('Failed to send transaction');
    }
});
document.getElementById('Send').addEventListener('click', async () => {
    console.log(toAddress.value);
    console.log(amount.value);
    try {
        // Send transaction request to the server
        const response = await fetch('http://localhost:3000/send-coins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromAddress: publicKey,
                toAddress: toAddress.value,
                amount: amount.value,
                privateKey: privateKey
            })
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Transaction Hash:', responseData.transactionHash);
            alert('Transaction sent successfully!');
        } else {
            throw new Error('Failed to send transaction');
        }
    } catch (error) {
        console.error('Error sending transaction:', error);
        alert('Failed to send transaction');
    }
});

fetch('http://localhost:3000/data')
    .then(response => response.json())
    .then(jsonData => {
        const tableBody = document.getElementById('table-body');

        // Loop through the JSON data and generate table rows
        jsonData.forEach(item => {
            const row = document.createElement('tr');

            // Create table cells for each property
            ['fromAddress', 'toAddress', 'amount'].forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = item[value];
                row.appendChild(cell);
            });
            const buttonCell = document.createElement('td');
            const button = document.createElement('button');
            button.textContent = 'Validate';
            button.className = 'row-button';
            button.id = "mine-btn"
            button.addEventListener('click', async () => {
                const fromAddress = item.fromAddress;
                const toAddress =  item.toAddress;
                const amount = item.amount;
                const myKey = item.privateKey;
                console.log(item);
                const miningRewardAddress = sessionStorage.getItem("publicKey");
                try {
                    const response = await fetch('http://localhost:3000/process-transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            fromAddress,
                            toAddress,
                            amount,
                            miningRewardAddress,
                            myKey
                        })
                    });
                    const data = await response.json();
                    if (data.success) {
                        alert("Transaction processed successfully!");
                        row.remove();
                    } else {
                        alert("Transaction failed: " + data.error);
                        console.error(data.error)
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("Failed to process transaction. Please try again.");
                }; // Show all row data as JSON string
            });
            buttonCell.appendChild(button);
            row.appendChild(buttonCell);
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching JSON data:', error));