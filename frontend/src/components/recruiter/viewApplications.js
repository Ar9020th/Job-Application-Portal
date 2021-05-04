import React, { Component } from "react";
import {
  fetchApplications,
  updateStatus,
  rejectApplication,
} from "../../actions/jobActions";
import Spinner from "../common/Spinner";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, ButtonToolbar } from "react-bootstrap";
import ViewEducation from "./viewEducation";
import ViewSOP from "./showSOP";
class ViewApplications extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      jobId: this.props.location.jobId,
      addModalShow: false,
      addModal2Show: false,
      educationData: [],
      sop: "",
      sort: "none",
    };
    this.applicationstage = this.applicationstage.bind(this);
    this.rejectstage = this.rejectstage.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
  }
  onSortChange(e) {
    this.setState({ sort: e.target.value });
  }
  componentDidMount() {
    console.log(this.state.jobId);
    if (this.state.jobId !== undefined) {
      this.props.fetchApplications(this.state.jobId);
      localStorage.setItem("jobId", this.state.jobId);
    } else {
      const jobid = localStorage.getItem("jobId");
      console.log(jobid);
      this.setState({ jobId: jobid }, () =>
        this.props.fetchApplications(jobid)
      );
    }
  }
  buttonData(state) {
    let bs = "";
    if (state === 0) bs = "Shortlist";
    if (state === 1) bs = "Accept";
    if (state === 2) bs = "Accepted";
    return bs;
  }
  applicationstage(data) {
    this.props.updateStatus(data);
  }
  rejectstage(data) {
    this.props.rejectApplication(data);
  }
  render() {
    let addModalClose = () =>
      this.setState({ addModalShow: false, addModal2Show: false });
    const { applicationsdata, loading } = this.props.job;
    const editmodal = (
      <ViewEducation
        initial={this.state.educationData}
        show={this.state.addModalShow}
        onHide={addModalClose}
      />
    );
    const editmodal2 = (
      <ViewSOP
        initial={this.state.sop}
        show={this.state.addModal2Show}
        onHide={addModalClose}
      />
    );
    let vaContent;
    if (applicationsdata === null || loading) {
      vaContent = <Spinner />;
    } else {
      if (this.state.sort === "nlth") {
        applicationsdata.sort(function (a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          } else if (a.name.toLowerCase() === b.name.toLowerCase()) return 0;
          else return 1;
        });
      } else if (this.state.sort === "nhtl") {
        applicationsdata.sort(function (a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return 1;
          } else if (a.name.toLowerCase() === b.name.toLowerCase()) return 0;
          else return -1;
        });
      } else if (this.state.sort === "alth") {
        applicationsdata.sort(function (a, b) {
          const x = a.rating === "Not rated" ? 0 : a.rating;
          const y = b.rating === "Not rated" ? 0 : b.rating;
          return x - y;
        });
      } else if (this.state.sort === "ahtl") {
        applicationsdata.sort(function (a, b) {
          const x = a.rating === "Not rated" ? 0 : a.rating;
          const y = b.rating === "Not rated" ? 0 : b.rating;
          return y - x;
        });
      } else if (this.state.sort === "dlth") {
        applicationsdata.sort(function (a, b) {
          if (a.dateOfApplication < b.dateOfApplication) {
            return -1;
          } else if (a.dateOfApplication === b.dateOfApplication) return 0;
          else return 1;
        });
      } else if (this.state.sort === "dhtl") {
        applicationsdata.sort(function (a, b) {
          if (a.dateOfApplication < b.dateOfApplication) {
            return 1;
          } else if (a.dateOfApplication === b.dateOfApplication) return 0;
          else return -1;
        });
      }
      vaContent = applicationsdata.map((obj) => (
        <tr key={obj._id}>
          <td>{obj.name}</td>
          <td>{obj.skills.join(",")}</td>
          <td>{obj.dateOfApplication}</td>
          <td>
            <ButtonToolbar className="md-4">
              <Button
                variant="secondary"
                onClick={() => {
                  this.setState({ educationData: obj.education }, () =>
                    this.setState({ addModalShow: true })
                  );
                }}
              >
                View
              </Button>
            </ButtonToolbar>
          </td>
          <center>
            <td>
              <Button
                variant="secondary"
                onClick={() => {
                  this.setState({ sop: obj.sop }, () =>
                    this.setState({ addModal2Show: true })
                  );
                }}
              >
                View
              </Button>
            </td>
          </center>
          <td>{obj.rating === "Not rated" ? 0 : obj.rating}</td>
          <td>
            {obj.status !== 0
              ? obj.status !== 1
                ? "Accepted"
                : "Shortlisted"
              : "Applied"}
          </td>
          {obj.status === 2 ? null : (
            <td>
              <button
                onClick={this.applicationstage.bind(this, {
                  jobId: this.state.jobId,
                  apid: obj._id,
                  stat: obj.status,
                  toname: obj.name,
                  toemail: obj.email,
                  fromname: this.props.auth.user.name,
                })}
                className="btn btn-success"
              >
                {this.buttonData(obj.status)}
              </button>
            </td>
          )}
          {obj.status === 2 ? null : (
            <td>
              <button
                onClick={this.rejectstage.bind(this, {
                  jobId: this.state.jobId,
                  apid: obj._id,
                })}
                className="btn btn-danger"
              >
                Reject
              </button>
            </td>
          )}
        </tr>
      ));
    }
    return (
      <div>
        <h4 className="mb-4">Education Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Sort</th>
              <th>
                <select
                  type="text"
                  className="form-control form-control-lg"
                  value={this.state.sort}
                  onChange={this.onSortChange}
                >
                  <option value="None">None</option>
                  <option value="nlth">Name (Low To High)</option>
                  <option value="nhtl">Name (High To Low)</option>
                  <option value="dlth">
                    Date Of Application (Low To High)
                  </option>
                  <option value="dhtl">
                    Date Of Application (High To Low)
                  </option>
                  <option value="alth">Applicant's Rating (Low To High)</option>
                  <option value="ahtl">Applicant's Rating (High To Low)</option>
                </select>
              </th>
            </tr>
            <tr>
              <th>Name</th>
              <th>Skills</th>
              <th>Date of Application</th>
              <th>Education</th>
              <th>Statement Of Purpose</th>
              <th>Rating</th>
              <th>Stage Of Application</th>
            </tr>
            {vaContent}
          </thead>
        </table>
        {editmodal}
        {editmodal2}
      </div>
    );
  }
}

ViewApplications.propTypes = {
  auth: PropTypes.object.isRequired,
  job: PropTypes.object.isRequired,
  fetchApplications: PropTypes.func.isRequired,
  updateStatus: PropTypes.func.isRequired,
  rejectApplication: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  job: state.job,
});

export default connect(mapStateToProps, {
  fetchApplications,
  updateStatus,
  rejectApplication,
})(ViewApplications);
