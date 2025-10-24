/*
[ Note : Exmple req.query ...

{
    slug: 'the-sea-explorer',
    difficulty: 'easy',
    limit: '3',
    duration: { gte: '14' },
    price: { lt: '1000' },
    sort: '-price,ratingsAverage'
    slug: 'the-sea-explorer',
    difficulty: 'easy',
    limit: '3',
    duration: { gte: '14' },
    price: { lt: '1000' },
    sort: '-price,ratingsAverage'
    duration: { gte: '14' },
    price: { lt: '1000' },
    sort: '-price,ratingsAverage'
}

*/

class QueryFeatures {
    constructor(mongooseQuery, reqQuery) {
        this.mongooseQuery = mongooseQuery;
        this.reqQuery = reqQuery;
        return this;
    }

    filter() {
        const filterObj = QueryFeatures.processReqQuery(this.reqQuery);
        this.mongooseQuery = this.mongooseQuery.find(filterObj);
        return this;
    }

    static processReqQuery({ ...reqQuery }) {
        // 1. Exclude Prohibited fields
        const excludeFields = ["page", "limit", "sort", "fields"];
        excludeFields.forEach((field) => delete reqQuery[field]);

        // 2. Add "$" before comparison operators
        let queryStr = JSON.stringify(reqQuery);
        const operators = ["gt", "gte", "lt", "lte", "ne", "eq"];
        operators.forEach(function (operator) {
            const regex = new RegExp(`(${operator})\\b`, "g");
            queryStr = queryStr.replace(regex, `$${operator}`);
        });

        reqQuery = JSON.parse(queryStr);
        return reqQuery;
    }
}

module.exports = QueryFeatures;
