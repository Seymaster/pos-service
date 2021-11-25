"use strict";

class MongodbRepository {
    constructor(Model){
        this.Model = Model
    }

    create(payload){
        return this.Model.create(payload);
    }

    find(condition, sort = {}){
        return this.Model.find(condition).sort(sort);
    }

    findById(id){
        return this.Model.findOne({_id: id});
    }


    findOne(condition, sort = {}){
        return this.Model.findOne(condition).sort(sort)
    }

    all(condition, sort = {_id: -1}, page = null, limit = 100){
        try{
            if(page){
                delete condition.page;
                delete condition.limit;
                return this.Model.paginate(condition,{sort,page, limit: parseInt(limit)});
               }
               else{
                   return this.Model.find(condition).sort(sort);
               }
        }catch(e){
            console.log(e);
            return this.Model.find(condition).sort(sort);
        }
    }

    truncate(condition = {}){
        if (process.env.NODE_ENV == "development"){
            return this.Model.deleteMany(condition);
        }
    }

    deleteMany(condition = {}){
        return this.Model.deleteMany(condition);
    }

    massInsert(data = []){
        if(data.length == 0)
            return [];
        return this.Model.insertMany(data)
    }

    aggregate(condition){
        return this.Model.aggregate([{$match :condition},{$group:{_id: null,total:{$sum : "$amount"}}}])
    }

    userAggregate(condition, sort = {}){
        return this.Model.aggregate([{$match :condition},{$group: {_id: "$user_id", total:{$sum : "$amount"}}},{$sort: sort}])
    }

    count(condition = {}){
        return this.Model.find(condition).countDocuments();
    }
    update(query, newData){
        return this.Model.updateMany(query, newData);
        // , {new: true}
    }
    upsert(query = {}, newData = {}){
        return this.Model.updateMany(query, newData, {upsert: true, new: true, setDefaultsonInsert: true});
    }

    sort(condition){
        return  this.Model.all(condition).sort()
    }

}

module.exports = MongodbRepository;