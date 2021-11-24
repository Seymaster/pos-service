const MerchantRepository = require("../models/MerchantRepository")
const { getPin } = require("../controllers/pin")

/**
 * Create Merchant and CRUD details
 * @param req
 * @param res
 * @param next
 * @return {Promise<*>}
 */

exports.createMerchant = async (req,res,next)=>{
    let {userId, title, MerchantType, MerchantLocation, start, end, MerchantDesc, MerchantImage} = req.body;
    let newMerchant = {userId, title, MerchantType, MerchantLocation, start, end, MerchantDesc, MerchantImage};
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
            console.log(err)
            return res.status(400).send({
            status:400,
            message: "Bad Request",
            error: err
                })
            }
        };
}