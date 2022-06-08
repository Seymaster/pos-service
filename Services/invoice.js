const fetch = require("node-fetch")
const baseUrl = process.env.mainbaseUrl
const clientId  = process.env.clientId
const clientSecret = process.env.clientSecret


async function createInvoice(productId,userId,amount){
    let result;
    let urlencoded =  {
                        "productId": productId,
                        "userId": userId,
                        "amount": amount,
                        "validity": 3,
                        "type": "one-off"
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
        const response = await fetch(`${baseUrl}/invoicing/v1/invoices`, requestOptions)
        result = await response.text();
    }
    catch(error){
        console.log("error", error)
    }

    // console.log(result);
    return await result;
};

module.exports = { createInvoice }

// let productId = "0a15d2bc-1c8c-4b83-a3e5-86b1e074b246"
// let userId = "61bdb499123d30001cfff59c"
// let amount = 1000
// createInvoice(productId,userId,amount)
// .then(data=>{
//         console.log(data)
//     }).catch(err =>{
//         console.log(err)
//     })