import { from } from "rxjs"

export class Collection {
    __modelSchema = null

    constructor(__modelSchema) {
        this.__modelSchema = __modelSchema
    }

    GET = (searchParams) => {
        console.log("Search Params: ", searchParams)
        return from(this.__modelSchema.find(searchParams))
    }
    GET_ONE = (searchParams) => {
        console.log("Search Params: ", searchParams)
        return from(this.__modelSchema.findOne(searchParams))
    }
    GET_COUNT = (searchParams) => {
        console.log("Search Params: ", searchParams)
        return from(this.__modelSchema.countDocuments(searchParams))
    }
    GET_TOP = (searchParams) => {
        console.log("Search Params: ", searchParams)
        return from(this.__modelSchema.find(searchParams).limit(100).sort({DateSubmitted: -1}))
    }
    AGGREGATE = (aggregateParams) => {
        console.log("Aggregate Params: ", aggregateParams)
        return from(this.__modelSchema.aggregate(aggregateParams).sort({DateSubmitted: -1}))
    }
    ADD = (data) => {
        console.log("Data: ", data)
        return from(new this.__modelSchema(data).save())
    }
    UPDATE = ({ identifier, data }) => {
        console.log("Identifier: ", identifier)
        console.log("Data: ", data)
        return from(this.__modelSchema.updateOne(identifier, data, { new: true }))
    }
    DELETE = (identifier) => {
        console.log("Identifier: ", identifier)
        return from(this.__modelSchema.deleteMany(identifier))
    }
    DELETE_ONE = (identifier) => {
        console.log("Identifier: ", identifier)
        return from(this.__modelSchema.deleteOne(identifier))
    }
}