const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validProfileInput = require("../../validation/recprofile");
const validJobInput = require("../../validation/addjob");
//Load Applicant Profile
const Profile = require("../../models/Recruiter");
const ApplicantProfile = require("../../models/Applicant");
const Job = require("../../models/job");
const User = require("../../models/User");
const isEmpty = require("../../validation/is-empty");
const job = require("../../models/job");
const Validator = require("validator");
const { session } = require("passport");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "connectone142@gmail.com",
    pass: "papers2825",
  },
});
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "email"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for the user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

//Create user profile POST
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body);
    const { errors, isValid } = validProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const recruiterFields = {};
    recruiterFields.user = req.user.id;
    recruiterFields.contactno = req.body.contactno;
    recruiterFields.bio = req.body.bio;
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: recruiterFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        new Profile(recruiterFields)
          .save()
          .then((profile) => res.json(profile));
      }
    });
  }
);

//addjob
router.post(
  "/addjob",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validJobInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const jobFields = {};
    jobFields.user = req.user.id;
    if (typeof req.body.reqSkillSets !== undefined) {
      jobFields.reqSkillSets = req.body.reqSkillSets.split(",");
    }
    jobFields.rating = {};
    jobFields.rating.sumofratings = 0;
    jobFields.rating.people = 0;
    jobFields.typeOfJob = req.body.typeOfJob;
    jobFields.duration = req.body.duration;
    jobFields.salary = req.body.salary;
    jobFields.dateOfPosting = req.body.dateOfPosting;
    jobFields.applicationDeadline = req.body.applicationDeadline;
    jobFields.title = req.body.title;
    jobFields.maxNumOfApplications = req.body.maxNumOfApplications;
    jobFields.maxNumOfPositions = req.body.maxNumOfPositions;
    jobFields.applicants = req.body.applicants;
    new Job(jobFields).save().then((job) => res.json(job));
  }
);

router.get(
  "/fetch-jobs",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Job.find({ user: req.user.id }, function (err, job) {
      res.json(job);
    });
  }
);

router.post(
  "/updateJob",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.body.maxNumOfApplications = !isEmpty(req.body.maxNumOfApplications)
      ? req.body.maxNumOfApplications
      : "";
    req.body.maxNumOfPositions = !isEmpty(req.body.maxNumOfPositions)
      ? req.body.maxNumOfPositions
      : "";
    req.body.applicationDeadline = !isEmpty(req.body.applicationDeadline)
      ? req.body.applicationDeadline
      : "";
    let errors = {};
    if (Validator.isEmpty(req.body.maxNumOfApplications.toString())) {
      errors.maxNumOfApplications =
        "Maximum Number of Applications is required";
    }
    if (Validator.isEmpty(req.body.maxNumOfPositions.toString())) {
      errors.maxNumOfPositions = "Maximum Number of Positions is required";
    }
    if (Validator.isEmpty(req.body.applicationDeadline)) {
      errors.applicationDeadline = "Application Deadline is required";
    }
    if (!isEmpty(errors)) {
      res.status(404).json(errors);
    }
    Job.findOne({ _id: req.body.id }).then((job) => {
      job.maxNumOfApplications = req.body.maxNumOfApplications;
      job.maxNumOfPositions = req.body.maxNumOfPositions;
      job.applicationDeadline = req.body.applicationDeadline;
      job.save().then((job) => res.json(job));
    });
  }
);

router.get(
  "/viewallapplications",
  passport.authenticate("jwt", { session: false }),
  async function (req, res) {
    Job.findOne({ _id: req.query.id })
      .populate("applicants.applicantId", ["name", "email"])
      .then(async function (jobq) {
        const data = await Promise.all(
          jobq.applicants.map(async function (ele) {
            let obj = {};
            obj._id = ele.applicantId._id;
            obj.name = ele.applicantId.name;
            obj.email = ele.applicantId.email;
            obj.dateOfApplication = ele.dateOfApplication;
            obj.sop = ele.sop;
            obj.status = ele.status;
            const profile = await ApplicantProfile.findOne({
              user: ele.applicantId._id,
            }).then(function (profile) {
              //console.log(profile);
              return profile;
            });
            //console.log(profile);
            obj.skills = profile.skills;
            obj.education = profile.education;
            obj.rating =
              profile.rating.people === 0
                ? "Not rated"
                : profile.rating.sumofratings / profile.rating.people;
            return obj;
          })
        );
        return res.json(data);
      });
  }
);

router.post(
  "/updatestatus",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let IsAccepted = false;
    await Job.findOne({ _id: req.body.jobId }).then(async (job) => {
      const editIndex = job.applicants
        .map((item) => item.applicantId)
        .indexOf(req.body.apid);
      job.applicants[editIndex].status++;
      if (job.applicants[editIndex].status === 2) {
        var mailOptions = {
          from: "connectone142@gmail.com",
          to: req.body.toemail,
          subject: "Welcome aboard " + req.body.toname,
          text:
            "Your application has been accepted by " +
            req.body.fromname +
            " for " +
            job.title +
            " job \n" +
            "With Regards. \n ConnectOne Team",
        };
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) console.log(err);
          else console.log("Email Sent:" + info.response);
        });
        job.applicants[editIndex].dateOfJoining = Date.now();
        IsAccepted = true;
      }
      await job.save();
      // console.log("wdq");
    });
    // console.log("chomtu");
    await ApplicantProfile.findOne({ user: req.body.apid }).then(
      async (profile) => {
        const editIndex = profile.applied
          .map((item) => item.jobId)
          .indexOf(req.body.jobId);
        profile.applied[editIndex].status++;
        await profile.save();
        console.log(profile);
        // console.log("inefwfe");
      }
    );
    // console.log("dwqnqwe");
    if (IsAccepted) {
      await ApplicantProfile.findOne({ user: req.body.apid }).then(
        (profile) => {
          profile.applied.forEach(async (ele) => {
            // console.log(ele.status);
            if (ele.status < 2) {
              ele.status = 3;
              await Job.findOne({ _id: ele.jobId }).then(async (job) => {
                const editIndex = job.applicants
                  .map((item) => item.applicantId)
                  .indexOf(req.body.apid);
                job.applicants.splice(editIndex, 1);
                await job.save();
              });
            }
          });
          profile.save();
        }
      );
    }
    res.json({ success: "Success" });
  }
);

router.post(
  "/rejectapplication",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Job.findOne({ _id: req.body.jobId }).then((job) => {
      const editIndex = job.applicants
        .map((item) => item.applicantId)
        .indexOf(req.body.apid);
      job.applicants.splice(editIndex, 1);
      job.save();
    });
    await ApplicantProfile.findOne({ user: req.body.apid }).then((profile) => {
      const editIndex = profile.applied
        .map((item) => item.jobId)
        .indexOf(req.body.jobId);
      profile.applied[editIndex].status = 3;
      profile.save();
    });
    res.json({ success: "Success" });
  }
);

router.get(
  "/accepted-employees",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Job.find({ user: req.user._id })
      .populate("applicants.applicantId", "name")
      .then((data) => {
        let obj = [];
        data.forEach((ele) => {
          // console.log(ele.applicants);
          let obj1 = {};
          obj1.jobId = ele._id;
          obj1.title = ele.title;
          obj1.typeOfJob = ele.typeOfJob;
          ele.applicants.forEach((ele1) => {
            let obj2 = {};
            obj2.name = ele1.applicantId.name;
            obj2.dateOfJoining = ele1.dateOfJoining;
            obj2.id = ele1.applicantId._id;
            obj2.initrating = ele1.rating;
            // console.log(obj);
            // const copyobj = obj1;
            obj.push({ ...obj1, ...obj2 });
            // console.log(obj);
          });
        });
        // console.log(obj);
        res.json(obj);
      });
  }
);

router.get(
  "/getratings",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ApplicantProfile.find().then((data) => {
      const obj = [];
      data.forEach((ele) => {
        let obj1 = {};
        obj1.rating =
          ele.rating.people === 0
            ? 0
            : ele.rating.sumofratings / ele.rating.people;
        obj1.id = ele.user;
        obj.push(obj1);
      });
      res.json(obj);
    });
  }
);

router.post(
  "/rateapplicant",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.body);
    await ApplicantProfile.findOne({ user: req.body.apid }).then((profile) => {
      if (req.body.notRated) {
        profile.rating.people++;
      }
      profile.rating.sumofratings -= req.body.prevrating;
      profile.rating.sumofratings += req.body.newrating;
      profile.save();
    });
    Job.findOne({ _id: req.body.jobId }).then((job) => {
      const editIndex = job.applicants
        .map((item) => item.applicantId)
        .indexOf(req.body.apid);
      job.applicants[editIndex].rating = req.body.newrating;
      job.save();
      res.json("successfull");
    });
  }
);

router.delete(
  "/deletejob/:job_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Job.findOne({ _id: req.params.job_id }).then(async function (job) {
      console.log(job);
      job.applicants.forEach(async (ele) => {
        console.log(ele);
        await ApplicantProfile.findOne({ user: ele.applicantId }).then(
          async (ap) => {
            console.log(ap);
            const editIndex = ap.applied
              .map((item) => item.jobId)
              .indexOf(req.params.job_id);
            ap.applied.splice(editIndex, 1);
            await ap.save();
            console.log(ap);
            return res.json("Success");
          }
        );
        return res.json("success");
      });
    });
    await Job.remove({ _id: req.params.job_id });
    return res.send("Successful");
  }
);

module.exports = router;
