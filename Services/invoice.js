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

// let productId = "805d18f8-70df-4896-9f91-b46e7143191d"
// let userId = "61a6756bca1ea2001c6c5329"
// let amount = 300
// createInvoice(productId,userId,amount)
// .then(data=>{
//         console.log(data)
//     }).catch(err =>{
//         console.log(err)
//     })