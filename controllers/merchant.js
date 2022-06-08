const MerchantRepository = require("../models/MerchantRepository")
const { getPin } = require("../controllers/pin")
const { checkWallet, initiateWithdraw } = require("../Services/billing")
const { createProduct } = require("../Services/product");
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
    let paymentCode = getPin()
    let productName = "ussd-"+ userId
    let product = await createProduct(productName, userId);
    product = JSON.parse(product);
    let productId = product.data.id
    let newMerchant = {userId, productId, name, industry, email, paymentCode, phoneNumber };
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




exports.merchantWithdraw = async (req, res, next) =>{
    let {transferAuthId, productId, amount} = req.body;
    try{
        // check wallet from merchant productId
        let wallet = await checkWallet(productId)
        wallet = JSON.parse(wallet)
        let wallets = wallet._embedded.wallets
        if(wallets.length === 0){
            return res.status(400).send({
                status: 400,
                message: "There is no Wallet Balance for this Merchant"
            })
        }
        else{   
            try{
                let payout = await initiateWithdraw(transferAuthId,productId,amount)
                return res.status(200).send({
                    status: 200,
                    message: "Balance Withdraw Successfully",
                    data: payout
                })
            }catch(err){
                return res.status(404).send({
                    status: 404,
                    message: "Not Found",
                    error: err
                })
            }
        }
    }catch(err){
        return res.status(404).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
}


