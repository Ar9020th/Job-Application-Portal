import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import { createJob } from "../../actions/jobActions";
import { Row, Col } from "react-bootstrap";
import Moment from "moment";
class CreateJobListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      maxNumOfApplications: 0,
      maxNumOfPositions: 0,
      dateOfPosting: "",
      applicationDeadlineDate: "",
      applicationDeadlineTime: "",
      reqSkillSets: "",
      typeOfJob: "Full-time",
      duration: 0,
      salary: 0,
      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeadd = this.onChangeadd.bind(this);
    this.onChangeadt = this.onChangeadt.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      console.log(nextProps.errors);
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onChangeadd(e) {
    this.setState({ applicationDeadlineDate: e.target.value });
  }
  onChangeadt(e) {
    this.setState({ applicationDeadlineTime: e.target.value });
  }
  onChangeType(e) {
    this.setState({ typeOfJob: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.applicationDeadlineDate);
    console.log(this.state.applicationDeadlineTime);
    const obj1 = Moment(
      this.state.applicationDeadlineDate + this.state.applicationDeadlineTime,
      "YYYY-MM-DDLT"
    );
    let dateTime = obj1.format("YYYY-MM-DDTHH:mm:s");
    dateTime += "0Z";
    const jobData = {
      title: this.state.title,
      maxNumOfApplications: this.state.maxNumOfApplications,
      maxNumOfPositions: this.state.maxNumOfPositions,
      dateOfPosting: this.state.dateOfPosting,
      applicationDeadline: dateTime,
      reqSkillSets: this.state.reqSkillSets,
      typeOfJob: this.state.typeOfJob,
      duration: this.state.duration,
      salary: this.state.salary,
      applicants: [],
    };
    console.log(jobData);
    this.props.createJob(jobData, this.props.history);
  }
  render() {
    const { errors } = this.state;
    return (
      <div className="create-job-listings">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create A Job Listing</h1>
              <p className="lead text-center">Let's get some information</p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <h4>Job Title</h4>
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.title,
                    })}
                    placeholder="Job Title"
                    name="title"
                    value={this.state.title}
                    onChange={this.onChange}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                  <small className="form-text text-muted"></small>
                </div>
                <div className="form-group">
                  <h4>Maximum Number of Applicants</h4>
                  <input
                    type="number"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.maxNumOfApplications,
                    })}
                    placeholder="Enter Max number of applications"
                    name="maxNumOfApplications"
                    value={this.state.maxNumOfApplications}
                    onChange={this.onChange}
                  />
                  {errors.maxNumOfApplications && (
                    <div className="invalid-feedback">
                      {errors.maxNumOfApplications}
                    </div>
                  )}
                  <small className="form-text text-muted"></small>
                </div>
                <div className="form-group">
                  <h4>Maximum Number of Positions</h4>
                  <input
                    type="number"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.maxNumOfPositions,
                    })}
                    placeholder="Enter Max number of positions"
                    name="maxNumOfPositions"
                    value={this.state.maxNumOfPositions}
                    onChange={this.onChange}
                  />
                  {errors.maxNumOfPositions && (
                    <div className="invalid-feedback">
                      {errors.maxNumOfPositions}
                    </div>
                  )}
                  <small className="form-text text-muted"></small>
                </div>
                <div className="form-group">
                  <h4>Date Of Posting</h4>
                  <input
                    type="date"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.dateOfPosting,
                    })}
                    placeholder="Enter Date Of Posting"
                    name="dateOfPosting"
                    value={this.state.dateOfPosting}
                    onChange={this.onChange}
                  />
                  {errors.dateOfPosting && (
                    <div className="invalid-feedback">
                      {errors.dateOfPosting}
                    </div>
                  )}
                  <small className="form-text text-muted"></small>
                </div>
                <div className="form-group">
                  <h4>Application Deadline</h4>
                  <Row>
                    <Col>
                      <input
                        type="date"
                        className={classnames("form-control form-control-lg", {
                          "is-invalid": errors.applicationDeadline,
                        })}
                        name="applicationDeadline"
                        value={this.state.applicationDeadlineDate}
                        onChange={this.onChangeadd}
                      />
                    </Col>
                    <Col>
                      <input
                        type="time"
                        className={classnames("form-control form-control-lg", {
                          "is-invalid": errors.applicationDeadline,
                        })}
                        name="applicationDeadline"
                        value={this.state.applicationDeadlineTime}
                        onChange={this.onChangeadt}
                      />
                    </Col>
                  </Row>
                  {errors.applicationDeadline && (
                    <div className="invalid-feedback">
                      {errors.applicationDeadline}
                    </div>
                  )}
                  <small className="form-text text-muted"></small>
                </div>
                <div className="form-group">
                  <h4>Required Skill Sets</h4>
                  <input
                    type="string"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.reqSkillSets,
                    })}
                    placeholder="Required Skill Sets"
                    name="reqSkillSets"
                    value={this.state.reqSkillSets}
                    onChange={this.onChange}
                  />
                  {errors.reqSkillSets && (
                    <div className="invalid-feedback">
                      {errors.reqSkillSets}
                    </div>
                  )}
                  <small className="form-text text-muted"></small>
                </div>
                <div className="form-group">
                  <label>Type Of Job:</label>
                  <select
                    type="text"
                    className="form-control form-control-lg"
                    value={this.state.typeOfJob}
                    onChange={this.onChangeType}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Work From Home">Work From Home</option>
                  </select>
                </div>
                <div className="form-group">
                  <h4>Duration</h4>
                  <input
                    type="number"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.duration,
                    })}
                    placeholder="Enter Duration"
                    name="duration"
                    value={this.state.duration}
                    onChange={this.onChange}
                  />
                  {errors.duration && (
                    <div className="invalid-feedback">{errors.duration}</div>
                  )}
                  <small className="form-text text-muted"></small>
                </div>
                <div className="form-group">
                  <h4>Salary</h4>
                  <input
                    type="number"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.salary,
                    })}
                    placeholder="Enter Salary"
                    name="salary"
                    value={this.state.salary}
                    onChange={this.onChange}
                  />
                  {errors.salary && (
                    <div className="invalid-feedback">{errors.salary}</div>
                  )}
                  <small className="form-text text-muted"></small>
                </div>
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateJobListings.propTypes = {
  job: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  job: state.job,
  errors: state.errors,
  auth: state.auth,
});

export default connect(mapStateToProps, { createJob })(
  withRouter(CreateJobListings)
);
