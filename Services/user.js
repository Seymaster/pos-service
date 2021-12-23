const fetch = require("node-fetch")
const baseUrl = process.env.mainbaseUrl
const clientId  = process.env.clientId
const clientSecret = process.env.clientSecret

// Create User API
async function createUser(phoneNumber){
    let raw = { 
            "name":"Unnamed User",
            "phoneNumber": phoneNumber,
            "password":"pmb",
            "age":12,
            "dob":"15/01/2012",
            "anyOtherThing":"value",
            "anyOtherThing1":"value1",
            "parentId":"ffdc48ee-46da-434b-ae85-27f461798848"
    };

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

async function findUser(phoneNumber){
    let requestOptions = {
        method: 'GET',
        headers:{  
            "client-secret": clientSecret,
            "client-id": clientId,
            "Content-Type": "application/json"
        },
        redirect: 'follow'
        };
        try{
            const response = await fetch(`${baseUrl}/users/v1/users?phoneNumber=${phoneNumber}`, requestOptions)
            return  await response.text();
        }
        catch(error){
            return {error};
        }
}

async function findUserbyId(user_id){
    let requestOptions = {
        method: 'GET',
        headers:{   "client-secret": clientSecret,
                    "client-id": clientId,
                    "Content-Type": "application/json"
        },
        redirect: 'follow'
        };
        try{
            const response = await fetch(`${baseUrl}/users/v1/users?userId=${user_id}`, requestOptions)
            return  await response.text();
        }
        catch(error){
            return {error};
        }
}

async function verifyUser(email){
    let raw = {
            "type":"email",
            "value": email,
            "createIfNotExist": "false",
            "redirectURL": redirect_url
        } ;
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
        const response = await fetch(`${baseUrl}/users/v1/auths/verify`, requestOptions)
        return await response.text();
    }
    catch(error){
        return {error};
    }
    // console.log(result);
}

async function forgotPassword(email){
    let requestOptions = {
        method: 'GET',
        headers:{   "client-secret": clientSecret,
                    "client-id": clientId,
                    "Content-Type": "application/json"
        },
        redirect: 'follow'
        };
        try{
            const response = await fetch(`${baseUrl}/users/v1/passwords/reset?type=email&value=${email}&redirectURL=${redirect_url}`, requestOptions)
            return  await response.text();
        }
        catch(error){
            return {error};
        }
}

// let phoneNumber = "8132461973"
// createUser(phoneNumber)
// .then(data=>{
//         // data = JSON.parse(data.user)
//         console.log(data)
//     }).catch(err =>{
//         console.log(err)
//     })

module.exports = { createUser, findUser, findUserbyId, verifyUser, forgotPassword };