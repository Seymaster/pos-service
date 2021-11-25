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
            console.log(err)
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
        if(Merchant === null){
            return res.status(400).send({
                status: 404,
                message: `No profile found for ${query}`,
                data: Merchant
            })
        }
        else{
            message = `Merchant for ${query} loaded successfully`
            return createSuccessResponse(res, Merchant ,message)
        }
    }catch(err){
        return res.status(400).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
}


// exports.fetchRevenue = async (req,res,next)=>{
//             return res.status(400).send({
//                 status: 404,
//                 message: "Revenue Loaded Successfully",
//                 data: Merchant
//             })
//         }