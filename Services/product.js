const fetch = require("node-fetch")
const baseUrl = process.env.mainbaseUrl
const clientId  = process.env.clientId
const clientSecret = process.env.clientSecret

// Product Service API
async function createProduct(name, merchantId){
    let result;
    let urlencoded = {  "name" : name,
                        "amount" : "200",
                        "type": "ussd",
                        "description": "USSD",
                        "externalProductId": merchantId
                    }       

    let requestOptions = {
        method: 'POST',
        headers: {  "Accept": "application/json",
                    "Content-Type": "application/json",
                    "client-secret": clientSecret,
                    "client-id": clientId
                },
        body: JSON.stringify(urlencoded),
        redirect: 'follow'
      };
    try{
        const response = await fetch(`${baseUrl}/products/v1/product`, requestOptions)
        result = await response.text();
    }
    catch(error){
        console.log("error", error)
    }

    // console.log(result);
    return await result;
}

// var eventName = 'gr2ac787'
// var merchantId = "61a6756bca1ea2001c6c5329"
// createProduct(eventName, merchantId)
// .then(data=>{
//         console.log(data)
//     }).catch(err =>{
//         console.log(err)
//     })

module.exports = { createProduct }