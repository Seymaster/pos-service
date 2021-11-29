const MerchantRepository = require("../models/MerchantRepository")
const { getPin } = require("../controllers/pin")

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
            message = `Merchant loaded successfully`
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


let kpis = [
    {totalRevenue: {"total": 408000}},
    {totalCustomer: {"total": 103}},
    {totalTransactions: {"total": 96}},
    {payoutBalance: {"total": 23000}}
]

exports.fetchKpis = async (req,res,next)=>{
            return res.status(200).send({
                status: 200,
                message: "Revenue Loaded Successfully",
                data: kpis
            })
        }

let graphData = [
    {
       data:  { time: "2021-11-01T18:45", revenue: 36283,
                time: "2021-11-02T18:45", revenue: 536722,
                time: "2021-11-03T18:45", revenue: 378488,
                time: "2021-11-04T18:45", revenue: 21882,
                time: "2021-11-02T18:45", revenue: 536722 }
    }
]

exports.fetchKpis = async (req,res,next)=>{
    return res.status(200).send({
        status: 200,
        message: "Revenue Loaded Successfully",
        data: graphData
    })
}