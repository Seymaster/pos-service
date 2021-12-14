const CustomerRepository = require("../models/CustomerRepository");
const TransactionRepository = require("../models/TransactionRepository");
const {createInvoice } = require("../Services/invoice");
const { createProduct } = require("../Services/product")
const { randomString } = require("../controllers/reference")


exports.createTransaction = async (req,res,next)=>{
    let {customerId, phoneNumber, paymentCode, merchantId, amount } = req.body;
    amount = amount *100
    let newTransaction = {customerId, phoneNumber, paymentCode, merchantId, amount }
    let newCustomer = {userId: customerId, paymentCode,phoneNumber}
    try {
        let customer = await CustomerRepository.findOne({userId: customerId})
        if(!customer){
            await CustomerRepository.create(newCustomer)
        }
        await TransactionRepository.create(newTransaction)
        let invoice = await createInvoice(merchantId,customerId, amount)
        invoice = JSON.parse(invoice)
        // let invoiceId = invoice.data.id
        return res.status(200).send({
            status: 200,
            message: "Initiate Payment Successfully",
            data: invoice
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            status:400,
            message: "Bad Request",
            error: error
        })
    }
}

// To get all transaction for a Particular merchant/customer with Id
exports.getTransactionById = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let Transaction = await TransactionRepository.all(query, {_id: -1}, page, limit)
        if(Transaction.docs.length === 0){
            return res.status(400).send({
                status: 404,
                message: `No Merchant found for id ${query}`,
                data: Transaction
            })
        }
        else{
            message = `Merchant for Id ${query} loaded successfully`
            return createSuccessResponse(res, Transaction ,message)
        }
    }catch(err){
        return res.status(400).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
};

// To get all Customer for a Particular Merchant
exports.getCustomerByMerchantId = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let customer = await CustomerRepository.all(query, {_id: -1}, page, limit)
        if(customer.docs.length === 0){
            return res.status(400).send({
                status: 404,
                message: `No Merchant found for id ${query.customerId}`,
                data: Transaction
            })
        }
        else{
            message = `Merchant for Id ${query} loaded successfully`
            return createSuccessResponse(res, customer ,message)
        }
    }catch(err){
        return res.status(400).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
};

