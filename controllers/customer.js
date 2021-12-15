const CustomerRepository = require("../models/CustomerRepository");
const TransactionRepository = require("../models/TransactionRepository");
const MerchantRepository = require("../models/MerchantRepository");
const { createInvoice } = require("../Services/invoice");
const { createProduct } = require("../Services/product");
const { initiateCharge } = require("../Services/payment");
const { createUser } = require("../Services/user");
const uuid = require("uuid");


exports.initiatePayment = async (req,res,next)=>{
    let {phoneNumber, paymentCode, amount, paymentAuthId } = req.body;
    amount = amount *100
    let reference = uuid.v4();
    let merchant = await MerchantRepository.findOne({paymentCode: paymentCode})
    let merchantId = merchant.userId
    let customerId;
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
    customerId = customer.userId
    let newTransaction = {reference, customerId, phoneNumber, paymentCode, merchantId, amount }
    console.log(newTransaction)
    await TransactionRepository.create(newTransaction);
    try {
        let name = "ussd-"+ merchantId
        let product = await createProduct(name, merchantId);
        product = JSON.parse(product);
        let productId = product.data.id
        let invoice = await createInvoice(productId,customerId, amount)
        invoice = JSON.parse(invoice)
        let invoiceId = invoice.data.id
        let payment = await initiateCharge(customerId,amount,paymentAuthId,reference,invoiceId)
        payment = JSON.parse(payment)
        return res.status(200).send({
            data: payment.data.transactionId
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            message: "Bad Request"
        })
    }
}


// To verify Payment
exports.createTransaction = async (req,res,next)=>{

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

