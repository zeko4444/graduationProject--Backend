const doctor = require("../Model/DoctorModel");
const schedual = require("../Model/scheduleModel");
const admin = require("../Model/adminModel");
const path = require("path");

let newaccount = async (req, res) => {
  const std = await doctor
    .findOne({ mobile: req.body.mobile, email: req.body.email })
    .exec();
  const std2 = await admin
    .findOne({ mobile: req.body.mobile, email: req.body.email })
    .exec();

  if (std || std2) {
    return res.status(401).send("doctore exist");
  }
  const mybody = req.body;
  console.log(mybody);
  const newdoc = new admin(mybody);
  newdoc
    .save()
    .then(() => {
      res.status(200).send("admin added successfull");
    })
    .catch((err) => {
      for (let e in err.errors) {
        console.log(err.errors[e].message);
        res.status(400).send("Bad Request...");
      }
    });
};

let getaccount = async (req, res) => {
  const doc = await admin.findOne({ mobile: req.session.user.mobile }).exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send(doc);
};

let updateaccount = async (req, res) => {
  const body = req.body;
  const doc = await admin.findByIdAndUpdate(req.session.user._id, body).exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send("succsess updating");
};

let activeadmin = async (req, res) => {
  const body = req.body;
  const doc = await admin
    .findOneAndUpdate({ mobile: req.body.mobile }, { isactive: true })
    .exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send("succsess updating");
};
let dactiveadmin = async (req, res) => {
  const body = req.body;
  const doc = await admin
    .findOneAndUpdate({ mobile: req.body.mobile }, { isactive: false })
    .exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send("succsess updating");
};

module.exports = {
  newaccount,
  getaccount,
  updateaccount,
  activeadmin,
  dactiveadmin,
};
