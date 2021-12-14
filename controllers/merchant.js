const MerchantRepository = require("../models/MerchantRepository")
const { getPin } = require("../controllers/pin")
const { checkWallet, initiateWithdraw } = require("../Services/billing")
const { transferAuth } = require("../Services/thirdparty")

/**
 * Create Merchant and CRUD details
 * @param req
 * @param res
 * @param next
 * @return {Promise<*>}
 */

 global.createSuccessResponse = (res, data, message, code= 200, isPaginated = false) => {
    if (isPaginated || (data && data.docs)) {
        data.data = data.docs;
        delete data.docs;
        delete data.pages
        delete data.limit
        data.status = code
        data.message = message;
        data.page = parseInt(data.page);
        return res.status(code).json(data);
    }
    return res.status(code).json({data});
};



exports.createMerchant = async (req,res,next)=>{
    let {userId, name, industry, email, phoneNumber } = req.body;
    let paymentId = getPin()
    let newMerchant = {userId, name, industry, email, paymentId,phoneNumber, };
    try{
        let Merchant = await MerchantRepository.create(newMerchant)
        return res.status(200).send({
            status:200,
            message: "Merchant Registered successfully",
            data: Merchant
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

exports.fetchMerchant = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let Merchant = await MerchantRepository.all(query, {_id: -1}, page, limit)
        if(Merchant.docs.length === 0){
            return res.status(400).send({
                status: 404,
                message: "No Merchant found with the input",
                data: Merchant.docs
            })
        }
        else{
            message = `Merchant loaded successfully`
            return createSuccessResponse(res, Merchant ,message)
        }
    }catch(err){
        return res.status(404).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
}




exports.merchantPayout = async (req, res, next) =>{
    let {transferAuthId, merchantId, amount} = req.body;
    try{
        let wallet = await checkWallet(merchantId)
        console.log(wallet)
        // if(wallet.__embedded.wallet === []){
        //     return res.status(404).send({
        //         status: 400,
        //         message: "There is no Wallet Balance for this Merchant"
        //     })
        // }
        try{
            let payout = await initiateWithdraw(transferAuthId,merchantId,amount)
            return res.status(200).send({
                status: 200,
                message: "Payout Balance Loaded Successfully",
                data: payout
            })
        }catch(err){
            return res.status(404).send({
                status: 404,
                message: "Not Found",
                error: err
            })
        }
    }catch(err){
        return res.status(404).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
}

