var invoices = '{"customer": "BigCo","performances": [{"playID": "hamlet","audience": 55},{"playID": "as-like","audience": 35},{"playID": "othello","audience": 40}]}';
var plays = '{"hamlet":{"name": "Hamlet", "type": "tragedy"},"as-like":{"name": "As You Like It", "type": "comedy"},"othello": {"name": "Othello", "type": "tragedy"}}';

var jsonObject_invoices = JSON.parse(invoices);//ここまでさっきの
var jsonObject_plays = JSON.parse(plays);//ここまでさっきの

function statement (invoices, plays){
    return renderPlainText(createStatementData(invoices, plays));
}

function createStatementData(invoices, plays){
    const statementData = {};
    statementData.customer = invoices.customer;
    statementData.performances = invoices.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function totalAmount(data){
        return data.performances
        .reduce((total, p) => total + p.amount, 0)
        ;
        }
        function totalVolumeCredits(data){
        return data.performances
        .reduce((total, p) => total + p.volumeCredit,0)
        ;
        }
        function enrichPerformance(aPerformance){
            const result = Object.assign({}, aPerformance);
            result.play = playFor(result) 
            result.amount = amountFor(result)
            result.volumeCredit = volumeCreditsFor(result)
    
            return result;
        }
        function volumeCreditsFor(aPerformance){
            let result = 0;
            result += Math.max(aPerformance.audience - 30, 0);
            if("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
            return result;
        }
        function playFor(aPerformance){
            return plays[aPerformance.playID];
        }
        function amountFor(aPerformance){
            let result = 0;
            switch (aPerformance.play.type){
                
                case "tragedy":
                    result = 40000;
                    if(aPerformance.audience > 30){
                        result += 1000 * (aPerformance.audience -30);
                    }
                    break;
                case "comedy":
                    result = 30000;
                    if(aPerformance.audience > 20){
                        result += 10000 + 500 * (aPerformance.audience -20);
                    }
                    result += 300 * aPerformance.audience;
                    break;
                default:
                    throw new Error(`unknown type:${perf.play.type}`);
            }
            return result;
        }
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


let test = statement(jsonObject_invoices, jsonObject_plays);
console.log(test);
htmlStatement(jsonObject_invoices, jsonObject_plays);