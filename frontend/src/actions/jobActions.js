import axios from "axios";
import { getCurrentProfile } from "./profileActions";
import {
  GET_ERRORS,
  FETCH_MY_JOBS,
  JOBS_LOADING,
  FETCH_ALL_JOBS,
  FETCH_APPLICATIONS,
  ACCEPTED_EMPLOYEES,
  GET_ALL_RATINGS,
} from "./types";
export const createJob = (jobData, history) => (dispatch) => {
  axios
    .post("/api/recruiter/addjob", jobData)
    .then((res) => history.push("./dashboard"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

export const fetchJobs = (userId) => (dispatch) => {
  dispatch(setJobsLoading());
  axios.get("/api/recruiter/fetch-jobs").then((res) => {
    dispatch({
      type: FETCH_MY_JOBS,
      payload: res.data,
    });
  });
};

export const setJobsLoading = () => {
  return {
    type: JOBS_LOADING,
  };
};

export const fetchAllJobs = (userId) => (dispatch) => {
  dispatch(setJobsLoading());
  axios.get("/api/applicant/alljobs").then((res) => {
    dispatch({
      type: FETCH_ALL_JOBS,
      payload: res.data,
    });
  });
};

export const submitApplication = (jobData) => async (dispatch) => {
  const f = await axios
    .post("/api/applicant/submit-application", jobData)
    .then((res) => {
      dispatch(fetchAllJobs());
      dispatch(getCurrentProfile("applicant"));
      return 1;
    });
  return f;
};

export const applicationsData = async () => {
  const f = await axios.get("/api/applicant/myapplicationsdata").then((res) => {
    return res.data;
  });
  return f;
};

export const updateJob = (jobData) => async (dispatch) => {
  const vgh = await axios
    .post("/api/recruiter/updateJob", jobData)
    .then((res) => {
      dispatch(fetchJobs());
      dispatch({
        type: GET_ERRORS,
        payload: {},
      });
      return 1;
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      return 0;
    });
  return vgh;
};

export const fetchApplications = (jobId) => async (dispatch) => {
  dispatch(setJobsLoading());
  await axios
    .get("/api/recruiter/viewallapplications", { params: { id: jobId } })
    .then((res) => {
      dispatch({
        type: FETCH_APPLICATIONS,
        payload: res.data,
      });
    });
};

export const updateStatus = (data) => (dispatch) => {
  axios.post("/api/recruiter/updatestatus", data).then((res) => {
    console.log("Adwdwadwad");
    dispatch(fetchApplications(data.jobId));
  });
};

export const rejectApplication = (data) => (dispatch) => {
  axios.post("/api/recruiter/rejectapplication", data).then((res) => {
    dispatch(fetchApplications(data.jobId));
  });
};

export const employeesAcceptedData = () => async (dispatch) => {
  dispatch(setJobsLoading());
  const data1 = await axios.get("/api/recruiter/accepted-employees");
  dispatch({
    type: ACCEPTED_EMPLOYEES,
    payload: data1.data,
  });
  const data2 = await axios.get("/api/recruiter/getratings");
  dispatch({
    type: GET_ALL_RATINGS,
    payload: data2.data,
  });
};

//delete job
export const deleteJob = (id) => (dispatch) => {
  axios
    .delete(`/api/recruiter/deletejob/${id}`)
    .then((res) => dispatch(fetchJobs()))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
