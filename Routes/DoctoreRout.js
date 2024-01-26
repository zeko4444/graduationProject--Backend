const express = require("express")
const doctorcontroller=require('../Controllers/DoctorController')
const route=express.Router()
const path=require("path")
module.exports=route;

let sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid&&req.session.user.isadmin==false) {
        
            next()
    } else {
        return res.status(403).send('forbidden....')
    }
  };


  //create new account
  route.post('/newaccount',doctorcontroller.newaccount)
  //get account for user
  route.get('/getaccount',sessionChecker,doctorcontroller.getaccount)
  //get timetable for user
  route.get('/gettimetable',sessionChecker,doctorcontroller.gettimetableforuser)
  //update account
  route.patch('/updateaccount',sessionChecker,doctorcontroller.updateaccount)
  //update timetable
  route.patch('/updatetimetable',sessionChecker,doctorcontroller.updatetimetable)
  //get appoint
  route.get('/getappointment',sessionChecker,doctorcontroller.getapointmentlist)
  