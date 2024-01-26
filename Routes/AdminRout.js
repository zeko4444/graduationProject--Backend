const express = require("express")
const doctorcontroller=require('../Controllers/DoctorController')
const admincontroller=require('../Controllers/AdminController')
const patientcontroller=require('../Controllers/PatientController')
const route=express.Router()
const path=require("path")
module.exports=route;

let sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid&&req.session.user.isadmin==true) {
        
          next()
    } else {
        return res.status(403).send('forbidden....')
        
    }
  };
//get dactive doctor
route.get('/getalldoctorsdactive',sessionChecker,doctorcontroller.getallaccountdactive)
  //get doctore account
  route.get('/getdoctoreaccount/:mobile',sessionChecker,doctorcontroller.getaccountforadmin)
  //get all doctors
  route.get('/getalldoctors',sessionChecker,doctorcontroller.getallaccount)
  //gettimetableforadmin
  route.get('/getdoctoretimetable/:mobile',sessionChecker,doctorcontroller.gettimetableforadmin)
  //update timetable for admin
  route.patch('/updatedoctoretimetable/:mobile',sessionChecker,doctorcontroller.updatetimetableforadmin)
  //active doctore
  route.patch('/activedoctor/:mobile',sessionChecker,doctorcontroller.activedoctore)
  //dactive doctore
  route.patch('/dactivedoctor/:mobile',sessionChecker,doctorcontroller.dactivedoctore)
    //get appoint
    route.get('/getappointment/:mobile',sessionChecker,doctorcontroller.getapointmentlistforadmin)

  //delete patinet account
  route.delete('/deletepatienaccount/:id',sessionChecker,patientcontroller.deleteaccount)
  //update patient account
  route.patch('/updatepatientaccount/:id',sessionChecker,patientcontroller.updateaccount)
  //get all patient account
  route.get('/getallpatientaccount',sessionChecker,patientcontroller.getallaccount)

  //new admin account
  route.post('/newaccount',sessionChecker,admincontroller.newaccount)
  //get admin account
  route.get('/getadminaccount',sessionChecker,admincontroller.getaccount)
  //update admin account
  route.patch('/updateadminaccount',sessionChecker,admincontroller.updateaccount)
  //active admin
  route.patch('/activeadmin',sessionChecker,admincontroller.activeadmin)
  //dactive admin
  route.patch('/dactiveadmin',sessionChecker,admincontroller.dactiveadmin)

