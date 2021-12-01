"use strict"

const fetch = require("node-fetch");
const redirect_url = process.env.stagingRedirect
const baseUrl = process.env.mainbaseUrl
const clientId  = process.env.clientId
const clientSecret = process.env.clientSecret

async function checkWallet(userId){
    let result;
    let requestOptions = {
        method: 'GET',
        headers: {
                "client-id": sandbox_b1bhqqdbbictlrlliu5o,
                "client-secret": sandbox_jLFPN0ImwZrfCuiGZZYGn80NnsfdvW2OQIPIGJptlst8SY74IX,
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

async function initiateWithdraw(transferId,userId,amount){
    // let result;
        var raw = JSON.stringify({
            "transferAuthId": transferId,
            "userId": userId,
            "clientId": clientId,
            "amount": amount,
            "paymentProvider": "paystack",
            "code" : 1234
        });
    
    var requestOptions = {
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
    return {data: await response.text()};

    }catch(error){console.log('error', error)}
    // return result;
}

let userId = "619a7e069e812f001c199e2d"
checkWallet(userId)
.then(data=> console.log(data))
.catch(err=> console.log(err))

console.log("here")

// Create User API
async function createUser(email){
    let raw = { 
                "name":"Unnamed User",
                "email": email,
                "password":"pmb",
                "age":12,
                "dob":"15/01/2012",
                "anyOtherThing":"value",
                "anyOtherThing1":"value1",
                "parentId":"ffdc48ee-46da-434b-ae85-27f461798848",
                "options": { 
                            "verificationType":"email",  
                            "verification": true,
                            "redirectURL": "http://google.com"
                            }
        
    }

    let requestOptions = {
    method: 'POST',
    headers:{   "Accept": "application/json",
                "client-secret": clientSecret,
                "client-id": clientId,
                "Content-Type": "application/json"
    },
    body: JSON.stringify(raw),
    redirect: 'follow'
    };
    try{
        const response = await fetch(`${baseUrl}/users/v1/users`, requestOptions)
        return  {user:await response.text()};
    }
    catch(error){
        return {error};
    }

    // console.log(result);
}
let email = "mom1@yopmail.com"
createUser(email)
.then(data=> console.log(data))
.catch(err=> console.log(err))


module.exports = { checkWallet, initiateWithdraw, createUser }