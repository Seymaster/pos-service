const fetch = require("node-fetch")
const baseUrl = process.env.mainbaseUrl
const clientId  = process.env.clientId
const clientSecret = process.env.clientSecret

async function checkWallet(userId){
    let result;
    let requestOptions = {
        method: 'GET',
        headers: {
                "client-id": clientId,
                "client-secret": clientSecret,
                },
        redirect: 'follow'
      };
    try{
        const response = await fetch(`${baseUrl}/billing/wallets?customerId=${userId}`, requestOptions)
        result = await response.text();
    }
    catch(error){
        console.log("error", error)
    }
    // console.log(result)
    return await result;
}

async function initiateWithdraw(transferAuthId,userId,amount){
    let result;
        let raw = JSON.stringify({
            "transferAuthId": transferAuthId,
            "userId": userId,
            "clientId": clientId,
            "amount": amount,
            "paymentProvider": "paystack",
            "code" : 1234
        });
    
    let requestOptions = {
      method: 'POST',
      headers: {
        "client-id": clientId,
        "client-secret": clientSecret,
        "Content-Type": "application/json"
    },
      body: raw,
      redirect: 'follow'
    };
    try{
    let response = await fetch(`${baseUrl}/billing/withdraw`, requestOptions)
    result = await response.text();

    }catch(error){console.log('error', error)}
    return result;
}

// let merchantId = "619a7e069e812f001c199e2d"
// let transferAuthId ="5f06cd527b121d001bf3fe9b"
// let amount = 20000
// initiateWithdraw(transferAuthId,merchantId,amount)
// .then(data=> console.log(data))
// .catch(err=> console.log(err))


module.exports = { checkWallet, initiateWithdraw }