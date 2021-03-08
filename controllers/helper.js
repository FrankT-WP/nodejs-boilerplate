import { combineLatest, of } from "rxjs";
import { mergeMap, last, map, reduce, tap, toArray } from "rxjs/operators";
import ValidateJs from "validate.js";

ValidateJs.validators.array = (arrayItems, itemConstraints) => {
    const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
        const error = ValidateJs.validate(item, itemConstraints);
        if (error) errors[index] = { error: error };
        return errors
    }, {})
    return Object.keys(arrayItemErrors).length === 0 ? null : { errors: arrayItemErrors }
};


export const validateOp = (schema, options) => tap((model) => {
    const errors = ValidateJs.validate(model, schema, options);
    if (errors) {
        throw errors;
    }
});

export const generateRequiredSchemaItems = (props) => {
    // acc is the accumulator, val is the current value
    return props.reduce((acc, val) => ({ ...acc, [val]: { presence: true } }), {})
}


export const getDefaultOperations = () => ({
    request_mapper: (req) => req,
    processor: tap(),
    request_reducer: (acc, val) => val,
    request_reducer_init: () => ({}),
    response_mapper: (req, res, next) => (val) => {
        console.log("Value: ", val)
        res.send(val)
    },
    error_handler: (req, res, next) => (err) => {
        console.log('error')
        console.error('Error: ', err)
        res.status(500).send(err)
    },
    requestValidationSchema: {},
    requestValidationOptions: {}
})

export const createController = (createdOperation = {}) => (req, res, next) => {
    const operation = { ...getDefaultOperations(), ...createdOperation }
    of(req)
        .pipe(
            validateOp(operation.requestValidationSchema, operation.requestValidationOptions),
            map(operation.request_mapper),
            operation.processor,
            reduce(operation.request_reducer, operation.request_reducer_init()),
        ).subscribe(
            operation.response_mapper(req, res, next),
            operation.error_handler(req, res, next)
        )
}

export const emitWhenComplete = (source, completionObservable) => source.pipe(
    mergeMap((v) => combineLatest(completionObservable.pipe(toArray()), of(v)).pipe(last()))
)
