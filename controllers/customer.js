const CustomerRepository = require("../models/CustomerRepository");
const TransactionRepository = require("../models/TransactionRepository");
const MerchantRepository = require("../models/MerchantRepository");
const md5 = require("md5")
const uuid = require("uuid");
const moment = require("moment")
const { createInvoice } = require("../Services/invoice");
const { initiateCharge, verifyPayment } = require("../Services/payment");
const { createUser } = require("../Services/user");



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
            let newCustomer = {userId: customerId,phoneNumber}
            await CustomerRepository.create(newCustomer)
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
                    data: reference,
                    payment: payment
                })
            }catch (error) {
                console.log(error)
                return res.status(400).send({
                    message: "Bad Request"
                })
            }
        }else{
            let customerId = customer.userId
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
}


// To verify Payment
exports.verifyPayment = async (req,res,next)=>{
    const { reference, code, amount } = req.body;
    try {
        let verify = await verifyPayment(reference,code,amount); 
        verify = JSON.parse(verify)
        if(verify.error){
            return res.status(403).send({
                status:403,
                message: "Error verifying Transaction",
                error: verify
            })
        }
        let Transaction = await TransactionRepository.findOne({reference: reference})
        if(!Transaction){
            return res.status(403).send({
                status:403,
                message: "No Transaction with this Reference Code"
            })
        }
        await TransactionRepository.update({reference:reference},{status: verify.data.status, updatedAt: Date.now()})
        return res.status(200).send({
            data: verify.data.status
        })
    }catch(error) {
        console.log(error)
        return res.status(400).send({
            message: "Bad Request",
            error: error
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
        let allTransation = await TransactionRepository.all(query, {_id: -1}, page, limit)
        let userIds = []
        allTransation.map(data =>{
            userIds.push(
            data.customerId)
        })
        let dob = await CustomerRepository.all({
            $or: [{userId: {$in: userIds}}]
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


exports.updatePin = async (req, res, next)=>{
    let {pin, phoneNumber} = req.body;
    let customer = await CustomerRepository.findOne({phoneNumber: phoneNumber})
    console.log(customer)
    if(!customer){
        let { user } = await createUser(phoneNumber);
        user = JSON.parse(user);
        if(user.error){
            return res.status(403).send({
                status:403,
                message: user
            })
        }
        let userId = user.data.data.id
        pin = md5(pin)
        let newCustomer = {userId,phoneNumber,pin}
        await CustomerRepository.create(newCustomer)
        return res.status(200).send({
            message: "Pin Updated Successfully"
        })
    }else{
        pin = md5(pin)
        await CustomerRepository.update({phoneNumber:phoneNumber},{pin: pin})
        return res.status(200).send({
            message: "Pin Updated Successfully"
        })
    }
}

// let now1 = new Date("2022-01-01T00:00:00+01:00")/ 1000
// console.log(now1)

// console.log()
exports.validatePin = async (req, res, next)=>{
    // let {pin, phoneNumber} = req.body;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 10;
    let query = {
        status: "SUCCESS",
        createdAt:
        {
            $lt: new Date()
            // $gte: new Date("2022-01-01T00:00:00+01:00")

        }
    }
    console.log(moment().subtract(7,"days").startOf("days"))
    try{
    let allTransation = await TransactionRepository.aggregateReportDate(query)
    // let customer = await CustomerRepository.findOne({phoneNumber: phoneNumber})
    // if(!customer){
    //         return res.status(403).send({
    //             status:403,
    //             message: "User Not Found"
    //         })
    //     }
    // pin = customer.pin
    // pin = md5(pin)
    return res.status(200).send({
        message: allTransation
    })}catch(err){
        console.log(err)
    }
}


exports.fetchReport = async (req,res,next) =>{
    let {page ,limit, ...query} = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
    
        let revenue = await TransactionRepository.aggregate(query, {status: "SUCCESS"})
        let transaction = await TransactionRepository.all(query, {_id: -1}, page, limit)
        let transactionGraph = await TransactionRepository.aggregateReportDate({status: "SUCCESS",createdAt:{$lt: new Date()}})
        let revenueGraph = await TransactionRepository.aggregateRevenue({createdAt:{$lt: new Date()}})
        let customers = []
        transaction.docs.map(data =>{
            customers.push(
            data.customerId)
        })
        customers = await CustomerRepository.all({
            $or: [{userId: {$in: customers}}]
        }, {_id: -1}, page, limit) 

        let data = {
            totalRevenue: revenue[0].total,
            totalTransactions: transaction.total,
            totalCustomers: customers.total,
            transactionGraph,
            revenueGraph
        }
        return res.status(200).send({
            status:200,
            message: "Reports Loaded Successfully",
            data: data
        })
    }catch(error){
        console.log(error)
        return res.status(400).send({
            status: 400,
            message: "Bad Request",
            error: error
        })
    }

}