var invoices = '{"customer": "BigCo","performances": [{"playID": "hamlet","audience": 55},{"playID": "as-like","audience": 35},{"playID": "othello","audience": 40}]}';
var plays = '{"hamlet":{"name": "Hamlet", "type": "tragedy"},"as-like":{"name": "As You Like It", "type": "comedy"},"othello": {"name": "Othello", "type": "tragedy"}}';

var jsonObject_invoices = JSON.parse(invoices);//ここまでさっきの
var jsonObject_plays = JSON.parse(plays);//ここまでさっきの

function statement (invoices, plays){

    function volumeCreditsFor(aPerformance){
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    let totalAmount = 0;
    let result =  " Statement for "+ invoices.customer + "\n"; //'Statement for ${invoices.customer}¥n';

    function usd(aNumber){
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumIntegerDigits: 2 }).format(aNumber/100);
    }
    

    function playFor(aPerformance){
        return plays[aPerformance.playID];
    }

    function totalVolumeCredits(){
        let volumeCredits = 0;
        for (let perf of invoices.performances) {
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;    
    }
    let volumeCredits = totalVolumeCredits();

    for (let perf of invoices.performances) {

        function amountFor(aPerformance){
            let result = 0;
            switch (playFor(perf).type){
                
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
                    throw new Error(`unknown type:${playFor(perf).type}`);
            }
            return result;
        }

        result += `   ${playFor(perf).name} ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }


    result += " Amount owed is " + usd(totalAmount) + "\n";
    result += " You earned " + volumeCredits + " " +  "credits\n";
    return result ;
}

let test = statement(jsonObject_invoices, jsonObject_plays);
console.log(test);