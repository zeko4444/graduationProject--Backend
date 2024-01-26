const bcrypt = require("bcrypt");
const patientmodel = require("../Model/patientModel");
const doctormodel = require("../Model/DoctorModel");
const schedulemodel = require("../Model/scheduleModel");
const bookDocModel = require("../Model/bookDocModel");

// @desc create newaccount for patient
let newaccount = async (req, res) => {
  const patient = await patientmodel
    .findOne({ mobile: req.body.mobile, email: req.body.email })
    .exec();

  if (patient) {
    return res.status(401).send("patient exist");
  }
  const mybody = req.body;

  const newPat = new patientmodel(mybody);
  newPat
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

// @desc login for patient
let login = async (req, res) => {
  const patient = await patientmodel
    .findOne({ email: req.body.email, isactive: true })
    .exec();

  if (patient) {
    const comparpass = await bcrypt.compare(
      req.body.password,
      patient.password
    );
    if (!comparpass) {
      return res.status(403).send("invaild username or password");
    }

    res.status(200).send(patient.mobile);
  } else {
    return res.status(404).send("not found");
  }
};

// @desc getDoctors and filter it by address and day
let getDoctors = async (req, res) => {
  let filterObject = { address: req.params.address };
  const doctors = await doctormodel
    .find(filterObject, { ratearr: 0 })
    .sort({ rate: -1 })
    .exec();

  if (!doctors || doctors.length === 0) {
    return res.status(200).send(doctors);
  }

  const day = req.params.day;

  const filteredDoctors = await Promise.all(
    doctors.map(async (doctor) => {
      const schedule = await schedulemodel.findOne({
        doctormobile: doctor.mobile,
      });
      switch (day) {
        case "sat":
          if (schedule.sat) return doctor;
          break;
        case "sun":
          if (schedule.sun) return doctor;
          break;
        case "mon":
          if (schedule.mon) return doctor;
          break;
        case "tue":
          if (schedule.tue) return doctor;
          break;
        case "wen":
          if (schedule.wen) return doctor;
          break;
        case "thu":
          if (schedule.thu) return doctor;
          break;
        case "fri":
          if (schedule.fri) return doctor;
          break;
      }
    })
  );

  const newDoctors = filteredDoctors.filter((doctor) => doctor !== undefined);

  res.status(200).send(newDoctors);
};

// @desc booking
let booking = async (req, res) => {
  const day = req.body.day;
  let dayOfWeek = 1;

  switch (day) {
    case "sat":
      dayOfWeek = 6;
      break;
    case "sun":
      dayOfWeek = 0;
      break;
    case "mon":
      dayOfWeek = 1;
      break;
    case "tue":
      dayOfWeek = 2;
      break;
    case "wen":
      dayOfWeek = 3;
      break;
    case "thu":
      dayOfWeek = 4;
      break;
    case "fri":
      dayOfWeek = 5;
      break;

    default:
      dayOfWeek = 6;
      break;
  }

  // Define the current date and time
  const currentDate = new Date();

  // Calculate the number of milliseconds until the next desired day of the week
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  const daysToSaturday = 6 - currentDate.getDay(); // Days until next Saturday
  const dayDiff = ((dayOfWeek + 7 - daysToSaturday - 1) % 7) + 1;
  const nextDay = new Date(
    currentDate.getTime() + dayDiff * millisecondsPerDay
  );

  // Format the next date as a string
  const nextDate = nextDay.toISOString().slice(0, 10); // YYYY-MM-DD format
  const date = new Date(nextDate);

  const doctor = await schedulemodel
    .findOne({ doctormobile: req.body.mobileDoc })
    .exec();
  let myopj = "20:58";
  switch (day) {
    case "sat":
      myopj = doctor.sattime.endTime;
      break;
    case "sun":
      myopj = doctor.suntime.endTime;
      break;
    case "mon":
      myopj = doctor.montime.endTime;
      break;
    case "tue":
      myopj = doctor.tuetime.endTime;
      break;
    case "wen":
      myopj = doctor.wentime.endTime;
      break;
    case "thu":
      myopj = doctor.thutime.endTime;
      break;
    case "fri":
      myopj = doctor.fritime.endTime;
      break;

    default:
      myopj = doctor.sattime.endTime;
      break;
  }
  //find if start time in book
  const starttime1 = await bookDocModel
    .findOne({ date: date })
    .sort({ time: -1 })
    .exec();
  let fntime = "20:58";
  if (starttime1) {
    const [startHours, startMinutes] = starttime1.time.split(":").map(Number);

    const [stopHours, stopMinutes] = myopj.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;

    const stopTotalMinutes = stopHours * 60 + stopMinutes;

    let newTotalMinutes = startTotalMinutes + 30;

    if (newTotalMinutes >= stopTotalMinutes) {
      return res.status(201).send("bussy...");
    }

    // Calculate the hours and minutes for the new time
    const newHours = Math.floor(newTotalMinutes / 60);
    const newMinutes = newTotalMinutes % 60;

    // Format the new time as a string
    const newTimeStr = `${String(newHours).padStart(2, "0")}:${String(
      newMinutes
    ).padStart(2, "0")}`;
    fntime = newTimeStr;
  } else {
    switch (day) {
      case "sat":
        fntime = doctor.sattime.startTime;
        break;
      case "sun":
        fntime = doctor.suntime.startTime;
        break;
      case "mon":
        fntime = doctor.montime.startTime;
        break;
      case "tue":
        fntime = doctor.tuetime.startTime;
        break;
      case "wen":
        fntime = doctor.wentime.startTime;
        break;
      case "thu":
        fntime = doctor.thutime.startTime;
        break;
      case "fri":
        fntime = doctor.fritime.startTime;
        break;

      default:
        fntime = doctor.sattime.startTime;
        break;
    }
  }

  const { mobileDoc, mobilePat } = req.body;
  const book = new bookDocModel({
    mobileDoc,
    mobilePat,
    date: date,
    time: fntime,
  });

  book
    .save()
    .then(() => {
      res.status(200).send(book);
    })
    .catch((err) => {
      for (let e in err.errors) {
        console.log(err.errors[e].message);
        res.status(400).send("Bad Request...");
      }
    });
};

//@desc showBooking for patient
let showBooking = async (req, res) => {
  const show = await bookDocModel
    .find({ mobilePat: req.params.mobilePat })
    .sort({ date: -1 })
    .exec();
  if (!show) {
    return res.status(404).send("not found");
  }
  res.status(200).send(show);
};

//@desc update account
let updateaccount = async (req, res) => {
  const body = req.body;
  const doc = await patientmodel
    .findOneAndUpdate({ mobile: req.params.mobilePat }, body)
    .exec();
  if (!doc) {
    return res.status(400).send("notfound");
  }
  res.status(200).send("succsess updating");
};

let ratedoctor = async (req, res) => {
  const doc = await doctormodel.findOne({ mobile: req.body.mobile }).exec();
  if (!doc) {
    return res.status(404).send("not found");
  }
  let newrate = 0;
  if (doc.ratearr.length == 0) {
    newrate = req.body.rate;
    let newratearr = doc.ratearr;
    newratearr.push(newrate);
    const doc2 = await doctormodel
      .findOneAndUpdate(
        { mobile: req.body.mobile },
        { rate: newrate, ratearr: newratearr }
      )
      .exec();
    if (!doc2) {
      return res.status(404).send("not found");
    }
    res.status(200).send("rate success");
  } else {
    let newratearr = doc.ratearr;
    newratearr.push(req.body.rate);
    const sum = newratearr.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / newratearr.length;
    newrate = avg;
    const doc3 = await doctormodel
      .findOneAndUpdate(
        { mobile: req.body.mobile },
        { rate: newrate, ratearr: newratearr }
      )
      .exec();
    if (!doc3) {
      return res.status(404).send("not found");
    }
    res.status(200).send("rate success");
  }
};

let getappointment = async (req, res) => {
  const booking = await bookDocModel
    .find({ mobilePat: req.params.mobile })
    .sort({ date: -1, time: -1 })
    .exec();
  if (!booking) {
    return res.status(404).send("notfound");
  }
  const std2 = await Promise.all(
    booking.map((person) => ({ mobile: person.mobileDoc }))
  );
  const std3 = await Promise.all(
    booking.map((person) => ({
      mobile: person.mobileDoc,
      time: person.time,
      date: person.date,
    }))
  );
  let newarr = [];

  for (i of std2) {
    const std4 = await doctormodel.findOne({ mobile: i.mobile });
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
  login,
  getDoctors,
  showBooking,
  updateaccount,
  booking,
  ratedoctor,
  getappointment,
};
