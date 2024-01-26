const patientmodel = require("../Model/patientModel");

let newaccount = async (req, res) => {
  const std = await patientmodel
    .findOne({ mobile: req.body.mobile, email: req.body.email })
    .exec();

  if (std) {
    return res.status(401).send("doctore exist");
  }
  const mybody = req.body;
  console.log(mybody);
  const newdoc = new patientmodel(mybody);
  newdoc
    .save()
    .then(() => {
      res.status(200).send("patient added successfull");
    })
    .catch((err) => {
      for (let e in err.errors) {
        console.log(err.errors[e].message);
        res.status(400).send("Bad Request...");
      }
    });
};

let getaccount = async (req, res) => {
  const doc = await patientmodel.findOne({ mobile: req.params.mobile }).exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send(doc);
};
let getallaccount = async (req, res) => {
  const doc = await patientmodel.find().exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send(doc);
};

let updateaccount = async (req, res) => {
  const body = req.body;
  const doc = await patientmodel.findByIdAndUpdate(req.params.id, body).exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send("succsess updating");
};
let deleteaccount = async (req, res) => {
  const doc = await patientmodel.findByIdAndDelete(req.params.id).exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send("succsess updating");
};

module.exports = {
  newaccount,
  getaccount,
  getallaccount,
  updateaccount,
  deleteaccount,
};
