const CredentialRepository = require("../models/CredentialRepository")

/**
 * Create Credential and CRUD details
 * @param req
 * @param res
 * @param next
 * @return {Promise<*>}
 */



exports.createCredential = async (req,res,next)=>{
    let {userId,businessType,regNumber,address,landmark,city,country,website,coi,memArt,dp,poba } = req.body;
    let newCredential = {userId,businessType,regNumber,address,landmark,city,country,website,coi,memArt,dp,poba };
    try{
        let Credential = await CredentialRepository.create(newCredential)
        return res.status(200).send({
            status:200,
            message: "Credential Registered successfully",
            data: Credential
        });
    }catch(err){
        console.log("here2")
        if(err.code == 11000){
            let error = err['errmsg'].split(':')[2].split(' ')[1].split('_')[0];
            res.status(500).send({
                message: `${error} already exist`,
                status: 11000,
                error: error
            });
        }else{
            // console.log(err)
            return res.status(400).send({
            status:400,
            message: "Bad Request",
            error: err
                })
            }
        };
}

exports.fetchCredential = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let Credential = await CredentialRepository.all(query, {_id: -1}, page, limit)
        if(Credential.docs.length === 0){
            return res.status(400).send({
                status: 404,
                message: "No Credential found with the input",
                data: Credential.docs
            })
        }
        else{
            message = `Credential loaded successfully`
            return createSuccessResponse(res, Credential ,message)
        }
    }catch(err){
        return res.status(404).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
}