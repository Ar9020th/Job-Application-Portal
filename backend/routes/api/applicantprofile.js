const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validProfileInput = require("../../validation/appprofile");
//Load Applicant Profile
const Profile = require("../../models/Applicant");
const validateEducationInput = require("../../validation/education");
const User = require("../../models/User");
const Job = require("../../models/job");

router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

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
    const { errors, isValid } = validProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const applicantFields = {};
    applicantFields.user = req.user.id;
    if (typeof req.body.skills !== undefined) {
      applicantFields.skills = req.body.skills.split(",");
    }
    applicantFields.rating = {};
    applicantFields.rating.sumofratings = req.body.rating.sumofratings;
    applicantFields.rating.people = req.body.rating.people;
    applicantFields.applied = req.body.applied;
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: applicantFields },
          { new: true, strict: false }
        ).then((profile) => res.json(profile));
      } else {
        new Profile(applicantFields)
          .save()
          .then((profile) => res.json(profile));
      }
    });
  }
);

// Add education
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(404).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = {
        institution_name: req.body.institution_name,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
      };
      profile.education.unshift(newEdu);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

//Delete education
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const removeIndex = profile.education
        .map((item) => item.id)
        .indexOf(req.params.edu_id);
      profile.education.splice(removeIndex, 1);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

//update education
router.post(
  "/update-education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(404).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = {
        institution_name: req.body.institution_name,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
      };
      const editIndex = profile.education
        .map((item) => item.id)
        .indexOf(req.body.id);
      profile.education[editIndex].institution_name = newEdu.institution_name;
      profile.education[editIndex].startdate = newEdu.startdate;
      profile.education[editIndex].enddate = newEdu.enddate;
      profile.save().then((profile) => res.json(profile));
    });
  }
);

router.get(
  "/alljobs",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Job.find()
      .populate("user", ["name", "email"])
      .then((jso) => {
        res.json(jso);
      });
  }
);

//submit application
router.post(
  "/submit-application",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Job.findOne({ _id: req.body.id }).then((job) => {
      const obj = {
        applicantId: req.user.id,
        sop: req.body.sop,
        status: 0,
        dateOfApplication: Date.now(),
      };
      job.applicants.unshift(obj);
      job.save().then((ele) => res.json(ele));
    });
    Profile.findOne({ user: req.user.id }).then((profile) => {
      console.log(profile);
      const obj = {
        jobId: req.body.id,
        stage: 0,
      };
      profile.applied.unshift(obj);
      profile.save().then((ele) => res.json(ele));
    });
  }
);

router.get(
  "/get-applications",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.find().populate("jobId", ["title", ""]);
  }
);

router.get(
  "/myapplicationsdata",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    data = [];
    await Profile.findOne({ user: req.user.id })
      .populate({
        path: "applied.jobId",
        populate: {
          path: "user",
        },
      })
      .then((profile) => {
        profile.applied.forEach((ele) => {
          let obj = {
            title: ele.jobId.title,
            salary: ele.jobId.salary,
            recruitername: ele.jobId.user.name,
            rating: ele.rating,
            jobId: ele.jobId._id,
            status: ele.status,
          };
          ele.jobId.applicants.filter(
            (obj1) => obj1.applicantId === req.user.id
          );
          // console.log(ele.jobId.applicants[0]);
          if (ele.jobId.applicants.length === 0) {
            obj.dateOfJoining = "Not Applicable";
          } else obj.dateOfJoining = ele.jobId.applicants[0].dateOfJoining;
          data.unshift(obj);
        });
      });
    res.json(data);
  }
);

//updateRating
router.post(
  "/updateJobRating",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const editIndex = profile.applied
        .map((item) => item.id)
        .indexOf(req.body.id);
      profile.applied[editIndex] = req.body.rating;
      profile.save().then((profile) => null);
    });
    Job.findOne({ _id: req.body.id }).then((job) => {
      job.rating.sumofratings += req.body.rating;
      job.rating.people += 1;
      job.save().then((job) => null);
    });
  }
);

router.post(
  "/ratejob",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.body);
    await Job.findOne({ _id: req.body.jobId }).then((job) => {
      if (req.body.notRated) {
        job.rating.people++;
      }
      job.rating.sumofratings -= req.body.prevrating;
      job.rating.sumofratings += req.body.newrating;
      job.save();
    });
    Profile.findOne({ user: req.body.apid }).then((profile) => {
      const editIndex = profile.applied
        .map((item) => item.jobId)
        .indexOf(req.body.jobId);
      profile.applied[editIndex].rating = req.body.newrating;
      profile.save();
      res.json("successfull");
    });
  }
);

module.exports = router;
