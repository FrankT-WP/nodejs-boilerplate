import {
  addJobController,
  getJobController,
  getJobsController,
  updateJobController,
  deleteJobController,
  deleteJobsController
} from '../controllers/job.controller'
import passport from 'passport'
import { verifyToken } from "../middleware/authentication"

const express = require("express")
const router = new express.Router()

router.post('/add', verifyToken, addJobController)
router.get('/getOne', verifyToken, getJobController)
router.get('/', verifyToken, getJobsController)
router.put('/update', verifyToken, updateJobController)
router.delete('/delete', verifyToken, deleteJobController)
router.delete('/deleteAll', verifyToken, deleteJobsController)


module.exports = router