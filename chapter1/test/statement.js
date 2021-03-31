import createStatementData from 'http://localhost/Refactoring/chapter1/test/createStatementData.js';

var invoices = '{"customer": "BigCo","performances": [{"playID": "hamlet","audience": 55},{"playID": "as-like","audience": 35},{"playID": "othello","audience": 40}]}';
var plays = '{"hamlet":{"name": "Hamlet", "type": "tragedy"},"as-like":{"name": "As You Like It", "type": "comedy"},"othello": {"name": "Othello", "type": "tragedy"}}';

var jsonObject_invoices = JSON.parse(invoices);//ここまでさっきの
var jsonObject_plays = JSON.parse(plays);//ここまでさっきの

function statement (invoices, plays){
    return renderPlainText(createStatementData(invoices, plays));
}

function renderPlainText (data){
    let result = `Statement for ${data.customer}\n`; 

    for (let perf of data.performances) {    
        result += `   ${perf.play.name} ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += ` Amount owed is  ${usd(data.totalAmount)}\n`;
    result += ` You earned ${data.totalVolumeCredits} "credits\n`;
    return result ;    
}

function usd(aNumber){
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumIntegerDigits: 2 }).format(aNumber/100);
}

function htmlStatement(invoices, plays){
    return renderHtmlText(createStatementData(invoices, plays));
}

function renderHtmlText (data){
    let result = `<h1>Statement for ${data.customer}</h1>\n`; 
    result += "<table>\n";
    result+= "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
    for (let perf of data.performances) {    
        result += `<tr><td>${perf.play.name}</td><td>${usd(perf.amount)}</td><td>(${perf.audience} seats)</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is  <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits} "credits</em></p>\n`;
    return result ;    
}

let testHtml = htmlStatement(jsonObject_invoices, jsonObject_plays);
document.getElementById("box").innerHTML = testHtml;

let test = statement(jsonObject_invoices, jsonObject_plays);
console.log(test);

