const fetch = require("node-fetch")
const baseUrl = process.env.mainbaseUrl
const clientId  = process.env.clientId
const clientSecret = process.env.clientSecret


async function initiateCharge(userId,amount,paymentAuthId,reference,invoiceId,provider){
    let result;
    let urlencoded =  {
                        
                        "userId": userId,
                        "amount": amount,
                        "paymentAuthId": paymentAuthId,
                        "transactionId": reference,
                        "narration": "merchant",
                        "invoiceId": invoiceId,
                        "provider": provider
                    }

    let requestOptions = {
    method: 'POST',
    headers: {  "Accept": "application/json",
                "client-id": clientId,
                "client-secret": clientSecret,
                "Content-Type": "application/json"
            },
    body: JSON.stringify(urlencoded),
    redirect: 'follow'
    };
    try{
        const response = await fetch(`${baseUrl}/payments/v3/providus/charge`, requestOptions)
        result = await response.text();
    }
    catch(error){
        console.log("error", error)
    }

    // console.log(result);
    return await result;
};


async function verifyPayment(reference,code,amount){
    let result;
    let urlencoded =  {
        "amount": amount,
    }
    let requestOptions = {
    method: 'POST',
    headers: {  "Accept": "application/json",
                "client-id": clientId,
                "client-secret": clientSecret,
                "Content-Type": "application/json"
            },
    body: JSON.stringify(urlencoded),
    redirect: 'follow'
    };
    try{
        const response = await fetch(`${baseUrl}/payments/v3/providus/checkout/${reference}?code=${code}`, requestOptions)
        result = await response.text();
    }
    catch(error){
        console.log("error", error)
    }

    // console.log(result);
    return await result;
};



module.exports = { initiateCharge, verifyPayment }

// let paymentAuthId = "805d18f8-70df-4896-9f91-b46e7143191d"
// let userId = "605cb7d2ff6e14001c0b5ad0"
// let invoiceId = "605cb7d2ff6e14001c0b5ad0"
// let amount = 2300
// let reference = "61250e24-c918-4708-8468-c3d86981ad75"
// let code = "4777"
// verifyPayment(reference,code,amount)
// .then(data=>{
//         console.log(data)
//     }).catch(err =>{
//         console.log(err)
//     })