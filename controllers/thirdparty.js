const fetch = require("node-fetch");
const redirect_url = process.env.stagingRedirect
const baseUrl = process.env.mainbaseUrl
const clientId  = process.env.clientId
const clientSecret = process.env.clientSecret

console.log("here")
async function transferAuth(walletId){
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
        const response = await fetch(`${baseUrl}/3ps/v1/transferauth/paystack/${walletId}`, requestOptions)
        result = await response.text();
    }
    catch(error){
        console.log("error", error)
    }
    // console.log(result)
    return await result;
}

let walletId = "46657883883"
transferAuth(walletId)
.then(data=> console.log(data))
.catch(err=> console.log(err))

module.exports = { transferAuth }