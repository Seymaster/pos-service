const CustomerRepository = require("../models/CustomerRepository");
const TransactionRepository = require("../models/TransactionRepository");
const MerchantRepository = require("../models/MerchantRepository");
const { createInvoice } = require("../Services/invoice");
const { initiateCharge, verifyPayment } = require("../Services/payment");
const { createUser } = require("../Services/user");
const uuid = require("uuid");


exports.initiatePayment = async (req,res,next)=>{
    let {phoneNumber, paymentCode, amount, paymentAuthId, provider } = req.body;
    provider = provider || "providus"
    amount = amount *100
    let reference = uuid.v4();
    let merchant = await MerchantRepository.findOne({paymentCode: paymentCode})
    if(!merchant){
            return res.status(403).send({
                status:403,
                message: "No Merchant with this Payment Code"
            })
        }
    let merchantId = merchant.userId
    let customer = await CustomerRepository.findOne({phoneNumber: phoneNumber})
        if(!customer){
            let { user } = await createUser(phoneNumber);
            user = JSON.parse(user);
            if(user.error){
                return res.status(403).send({
                    status:403,
                    message: user
                })
            }
            user = user.data
            let customerId = user.user.userId;
            let newCustomer = {userId: customerId, merchantId,phoneNumber}
            await CustomerRepository.create(newCustomer)
        }
        let custom = await CustomerRepository.findOne({phoneNumber: phoneNumber})
        let customerId = custom.userId
    try {
        let productId = merchant.productId
        let invoice = await createInvoice(productId,customerId, amount)
        invoice = JSON.parse(invoice)
        let invoiceId = invoice.data.id
        let newTransaction = {reference, customerId, phoneNumber, paymentCode, merchantId, amount, invoiceId}
        await TransactionRepository.create(newTransaction);
        let payment = await initiateCharge(customerId,amount,paymentAuthId,reference,invoiceId,provider)
        payment = JSON.parse(payment)
        return res.status(200).send({
            data: reference
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            message: "Bad Request"
        })
    }
}


// To verify Payment
exports.verifyPayment = async (req,res,next)=>{
    const { reference, code } = req.body;
    try {
        let verify = await verifyPayment(reference,code); 
        return res.status(200).send({
            data: verify
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            message: "Bad Request"
        })
    }

}

// To get all transaction for a Particular merchant/customer with Id
exports.getTransaction = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let Transaction = await TransactionRepository.all(query, {_id: -1}, page, limit)
        if(Transaction.docs.length === 0){
            return res.status(400).send({
                status: 404,
                message: `No Transaction found for id ${query}`,
                data: Transaction
            })
        }
        else{
            message = "Transaction loaded successfully"
            return createSuccessResponse(res, Transaction ,message)
        }
    }catch(err){
        return res.status(400).send({
            status: 400,
            message: "Bad Request",
            error: err
        })
    }
};

// To get all Customer for a Particular Merchant
exports.getCustomers = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let customer = await CustomerRepository.all(query, {_id: -1}, page, limit)
        if(customer.docs.length === 0){
            return res.status(404).send({
                status: 404,
                message: `No Customer found`,
                data: customer
            })
        }
        else{
            message = "Customer loaded successfully"
            return createSuccessResponse(res, customer ,message)
        }
    }catch(err){
        console.log(err)
        return res.status(400).send({
            status: 400,
            message: "Bad Request",
            error: err
        })
    }
};

// Get all Merchant Customer 
exports.getMerchantCustomer = async (req, res, next)=>{
    let {...query} = req.params
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let allTransation = await TransactionRepository.all(query)
        let userIds = []
        allTransation.map(data =>{
            userIds.push(
            data.customerId)
        })
        let dob = await CustomerRepository.all({
            $or: [{customerId: {$in: userIds}}]
        }, {_id: -1}, page, limit) 
        message = `Customers for Merchant loaded successfully`
        return createSuccessResponse(res, dob ,message)
    }catch(error){
        console.log(error)
        return res.status(400).send({
            status:400,
            message: "Error",
            error: error   
        });
    }
}
