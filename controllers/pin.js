function getPin() {
    let pin = Math.round(Math.random() * 10000);
    let pinStr = pin + '';
    // make sure that number is 4 digit
    if (pinStr.length == 4) {
        return pinStr;
       } else {
        return getPin();
       }
    }

    
module.exports = { getPin }