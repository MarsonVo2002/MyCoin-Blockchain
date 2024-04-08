const fs = require('fs');
var history = fs.readFileSync('transactions.json', 'utf8')
data = JSON.parse(history)
for(let i = 0 ;i < data.length;i++)
{
    console.log(data[i].fromAddress);
}