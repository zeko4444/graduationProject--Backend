const doctor = require("../Model/DoctorModel");
const schedual = require("../Model/scheduleModel");
const admin = require("../Model/adminModel");
const path = require("path");
const bookDoc = require("../Model/bookDocModel");
const patientmodel = require("../Model/patientModel");

let newaccount = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

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
  const newdoc = new doctor(mybody);
  newdoc
    .save()
    .then(() => {
      // Create a new schedule document
      const newSchedule = new schedual({
        doctormobile: req.body.mobile,
        sat: false,
        sattime: {
          startTime: "20:58",
          endTime: "20:58",
        },
        sun: false,
        suntime: {
          startTime: "20:58",
          endTime: "20:58",
        },
        mon: false,
        montime: {
          startTime: "20:58",
          endTime: "20:58",
        },
        tue: false,
        tuetime: {
          startTime: "20:58",
          endTime: "20:58",
        },
        wen: false,
        wentime: {
          startTime: "20:58",
          endTime: "20:58",
        },
        thu: false,
        thutime: {
          startTime: "20:58",
          endTime: "20:58",
        },
        fri: false,
        fritime: {
          startTime: "20:58",
          endTime: "20:58",
        },
      });

      newSchedule
        .save()
        .then(() => {
          res.status(200).send("doctor addes sucsess");
        })
        .catch((err) => {
          for (let e in err.errors) {
            console.log(err.errors[e].message);
            res.status(400).send("Bad Request2...");
          }
        });
    })
    .catch((err) => {
      for (let e in err.errors) {
        console.log(err.errors[e].message);
        res.status(400).send("Bad Request...");
      }
    });
};

let getaccount = async (req, res) => {
  const doc = await doctor.findOne({ mobile: req.session.user.mobile }).exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }

  res.status(200).send(doc);
};

let getaccountforadmin = async (req, res) => {
  const doc = await doctor.findOne({ mobile: req.params.mobile }).exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send(doc);
};

let gettimetableforuser = async (req, res) => {
  const doc = await schedual
    .findOne({ doctormobile: req.session.user.mobile })
    .exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send(doc);
};

let gettimetableforadmin = async (req, res) => {
  const doc = await schedual
    .findOne({ doctormobile: req.params.mobile })
    .exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send(doc);
};

let updateaccount = async (req, res) => {
  const body = req.body;
  const doc = await doctor.findByIdAndUpdate(req.session.user._id, body).exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  const doc2 = await doctor.findById(req.session.user._id).exec();
  req.session.user = doc2;
  res.status(200).send(doc2);
};
let updatetimetable = async (req, res) => {
  const body = req.body;
  const doc = await schedual
    .findOneAndUpdate({ mobile: req.session.user.mobile }, body)
    .exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send(doc);
};
let updatetimetableforadmin = async (req, res) => {
  const body = req.body;
  const doc = await schedual
    .findOneAndUpdate({ mobile: req.params.mobile }, body)
    .exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send("succsess updating");
};

let activedoctore = async (req, res) => {
  const body = req.body;
  const doc = await doctor
    .findOneAndUpdate({ mobile: req.params.mobile }, { isactive: true })
    .exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send("succsess updating");
};
let dactivedoctore = async (req, res) => {
  const body = req.body;
  const doc = await doctor
    .findOneAndUpdate({ mobile: req.params.mobile }, { isactive: false })
    .exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send("succsess updating");
};
let getallaccount = async (req, res) => {
  const doc = await doctor.find().exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send(doc);
};
let getallaccountdactive = async (req, res) => {
  const doc = await doctor.find({ isactive: false }).exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send(doc);
};

let getapointmentlist = async (req, res) => {
  const std = await bookDoc.find({ mobileDoc: req.session.user.mobile }).exec();
  if (!std) {
    return res.status(404).send("notfound");
  }

  const std2 = await Promise.all(
    std.map((person) => ({ mobile: person.mobilePat }))
  );
  const std3 = await Promise.all(
    std.map((person) => ({
      mobile: person.mobilePat,
      time: person.time,
      date: person.date,
    }))
  );

  let newarr = [];

  for (i of std2) {
    const std4 = await patientmodel.findOne({ mobile: i.mobile });
    newarr.push(std4);
  }
  const result = await Promise.all(
    std3.map((appt, index) => ({
      mobile: appt.mobile,
      time: appt.time,
      date: appt.date,

      firstName: newarr[index].firstName,
      lastName: newarr[index].lastName,
    }))
  );
  return res.status(200).send(result);
};

let getapointmentlistforadmin = async (req, res) => {
  const std = await bookDoc.find({ mobileDoc: req.params.mobile }).exec();
  if (!std) {
    return res.status(404).send("notfound");
  }

  const std2 = await Promise.all(
    std.map((person) => ({ mobile: person.mobilePat }))
  );
  const std3 = await Promise.all(
    std.map((person) => ({
      mobile: person.mobilePat,
      time: person.time,
      date: person.date,
    }))
  );

  let newarr = [];

  for (i of std2) {
    const std4 = await patientmodel.findOne({ mobile: i.mobile });
    newarr.push(std4);
  }
  const result = await Promise.all(
    std3.map((appt, index) => ({
      mobile: appt.mobile,
      time: appt.time,
      date: appt.date,

      firstName: newarr[index].firstName,
      lastName: newarr[index].lastName,
    }))
  );
  return res.status(200).send(result);
};

module.exports = {
  newaccount,
  getaccount,
  updateaccount,
  updatetimetable,
  activedoctore,
  dactivedoctore,
  gettimetableforadmin,
  gettimetableforuser,
  getaccountforadmin,
  updatetimetableforadmin,
  getallaccount,
  getallaccountdactive,
  getapointmentlist,
  getapointmentlistforadmin,
};
