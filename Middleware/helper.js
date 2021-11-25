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
