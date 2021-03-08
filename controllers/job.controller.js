import { createController, generateRequiredSchemaItems } from "./helper"
import { JobModel } from "../models/job.schema"
import { Collection } from "../utilities/database"
import { tokenKey } from "../config"
import { pipe, zip, of } from "rxjs"
import { mergeMap } from "rxjs/operators"
import { generatePassword } from "../utilities/security"
import { sendMessage } from "../utilities/messaging"

const jwt = require('jsonwebtoken');

const jobs = new Collection(JobModel)


// add a Job CRUD operation
const AddJobOperation = {
  requestValidationSchema: generateRequiredSchemaItems([
    'body.Name',
    'body.Description',
  ]),
  request_mapper: (req) => req.body,
  processor: mergeMap(props => {
    return jobs.ADD({
      Name: props.Name,
      Description: props.Description
    })
  }),
  response_mapper: (req, res) => (val) => {
    res.send({
      data: val,
      message: "Successfully added a Job!",
    })

  }
}

// GET a particular Job's details operation
const GetJobOperation = {
  requestValidationSchema: generateRequiredSchemaItems([
    'body.Name'
  ]),
  request_mapper: (req) => req.body,
  processor: mergeMap(props => jobs.GET_ONE({ Name: props.Name })),
  response_mapper: (req, res) => (val) => {
    res.send(val)
  }
}

// GET all Jobs operation
const GetJobsOperation = {

  // get specific job
  // processor: mergeMap(props => jobs.GET({ Name: "Full Stack Developer" })),
  // get all
  processor: mergeMap(props => jobs.GET()),
  response_mapper: (req, res) => (val) => {
    res.send(val)
  }
}

// Update a Job operation
const UpdateJobOperation = {
  requestValidationSchema: generateRequiredSchemaItems([
    'body._id',
    'body.Name',
    'body.Description',
  ]),
  request_mapper: (req) => req.body,
  processor: pipe(

    mergeMap(props => {
      return zip(
        jobs.UPDATE({
          identifier: {
            _id: props._id
          },
          data: {
            Name: props.Name,
            Description: props.Description
          }
        }),
        of(props)
      )
    }),
    mergeMap(([update_status, props]) => jobs.GET_ONE({ _id: props._id }))

  ),

  response_mapper: (req, res) => (val) => {
    console.log(val);

    res.send({
      // data: val,
      val: val,
      message: "Successfully updated a Job!",
    })
  }
}


// delete A Job Operation
const DeleteJobOperation = {
  requestValidationSchema: generateRequiredSchemaItems([
    'body.Name'
  ]),
  request_mapper: (req) => req.body,
  processor: mergeMap(props => jobs.DELETE_ONE({
    Name: props.Name
  })),
  response_mapper: (req, res) => (val) => {
    res.send({
      data: val,
      message: "Successfully Deleted a Job!",

    })
  }
}

// delete All Jobs Operation
const DeleteJobsOperation = {

  processor: mergeMap(props => jobs.DELETE()),
  response_mapper: (req, res) => (val) => {
    res.send({
      data: val,
      message: "Successfully Deleted all Jobs!",

    })
  }
}



export const addJobController = createController(AddJobOperation)
export const getJobsController = createController(GetJobsOperation)
export const getJobController = createController(GetJobOperation)
export const updateJobController = createController(UpdateJobOperation)
export const deleteJobController = createController(DeleteJobOperation)
export const deleteJobsController = createController(DeleteJobsOperation)

