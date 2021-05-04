import React, { Component } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import Spinner from "../common/Spinner";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchAllJobs } from "../../actions/jobActions";
import { getCurrentProfile } from "../../actions/profileActions";
import ApplySop from "./applySop";
import moment from "moment";
class JobListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      sort: "None",
      filter: "none",
      filteroption1: "none",
      filteroption2: "",
      filteroption3: "",
      filterstate: false,
      addModalShow: false,
      jobid: "",
      errors: {},
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onFilterOption1Change = this.onFilterOption1Change.bind(this);
    this.onFilterOption2Change = this.onFilterOption2Change.bind(this);
    this.onFilterOption3Change = this.onFilterOption3Change.bind(this);
  }
  onSearchChange(e) {
    this.setState({ search: e.target.value });
  }
  onSortChange(e) {
    this.setState({ sort: e.target.value });
  }
  onFilterChange(e) {
    this.setState({ filter: e.target.value });
  }
  onFilterOption1Change(e) {
    this.setState({ filteroption1: e.target.value });
  }
  onFilterOption2Change(e) {
    this.setState({ filteroption2: e.target.value });
  }
  onFilterOption3Change(e) {
    this.setState({ filteroption3: e.target.value });
  }
  componentDidMount() {
    const usertype = this.props.auth.user.usertype;
    this.props.fetchAllJobs();
    this.props.getCurrentProfile(usertype);
  }
  render() {
    let addModalClose = () => this.setState({ addModalShow: false });
    let allJobs;
    let { alljobs, loading } = this.props.job;
    const loading2 = this.props.profile.loading;
    const profile = this.props.profile;
    let filterOptions;
    const appliedbutton = (
      <td>
        <ButtonToolbar className="md-4">
          <Button
            variant="success"
            disabled="true"
            // onClick={() => this.setState({ addModalShow: true })}
          >
            Applied
          </Button>
        </ButtonToolbar>
      </td>
    );
    const exceedbutton = (
      <td>
        <ButtonToolbar className="md-4">
          <Button
            variant="danger"
            disabled="true"
            // onClick={() => this.setState({ addModalShow: true })}
          >
            Full
          </Button>
        </ButtonToolbar>
      </td>
    );
    const cannotApplybutton = (
      <td>
        <ButtonToolbar className="md-4">
          <Button
            variant="danger"
            disabled="true"
            // onClick={() => this.setState({ addModalShow: true })}
          >
            Cannot Apply
          </Button>
        </ButtonToolbar>
      </td>
    );
    if (this.state.filter === "jobtype") {
      if (this.state.filteroption1 !== "none") {
        alljobs = alljobs.filter(
          (obj) => obj.typeOfJob === this.state.filteroption1
        );
      }
    } else if (this.state.filter === "salary") {
      if (this.state.filteroption2 !== "" && this.state.filteroption3 != "") {
        const x = parseInt(
          this.state.filteroption2 === "" ? 0 : this.state.filteroption2
        );
        const y = parseInt(
          this.state.filteroption3 === "" ? 0 : this.state.filteroption3
        );
        alljobs = alljobs.filter((obj) => obj.salary >= x && obj.salary <= y);
      }
    } else if (this.state.filter === "duration") {
      if (
        this.state.filteroption2 !== "none" &&
        this.state.filteroption2 !== ""
      ) {
        const x = parseInt(this.state.filteroption2);
        alljobs = alljobs.filter((obj) => obj.duration < x);
      }
    }
    if (this.state.filter === "none") {
      filterOptions = null;
    } else if (this.state.filter === "jobtype") {
      filterOptions = (
        <div>
          <th>
            <select
              type="text"
              className="form-control form-control-lg"
              value={this.state.filteroption1}
              onChange={this.onFilterOption1Change}
            >
              <option value="none">None</option>
              <option value="Full-time">Full Time</option>
              <option value="Part-time">Part Time</option>
              <option value="Work From Home">Work From Home</option>
            </select>
          </th>
        </div>
      );
    } else if (this.state.filter === "salary") {
      filterOptions = (
        <div>
          <th>
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="Low"
              name="search"
              value={this.state.filteroption2}
              onChange={this.onFilterOption2Change}
            />
          </th>
          <th>
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="High"
              name="search"
              value={this.state.filteroption3}
              onChange={this.onFilterOption3Change}
            />
          </th>
        </div>
      );
    } else {
      filterOptions = (
        <div>
          <th>
            <select
              type="number"
              className="form-control form-control-lg"
              value={this.state.filteroption2}
              onChange={this.onFilterOption2Change}
            >
              <option value="none">None</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
          </th>
        </div>
      );
    }
    let openApplications = 0;
    if (alljobs === null || loading || profile === null || loading2) {
      allJobs = <Spinner />;
    } else {
      let { applied } = this.props.profile.profile;
      const buttonutils = this.props.job.alljobs.map(function (obj) {
        const obj1 = {};
        obj1.jobId = obj._id;
        obj1.numberOfApplications = obj.applicants.length;
        let numberOfPositions = 0;
        obj.applicants.forEach(function (ele) {
          if (ele.status === 2) {
            numberOfPositions++;
          }
        });
        obj1.numberOfPos = numberOfPositions;
        return obj1;
      });
      let isEmployee = false;
      applied = applied.map(function (obj) {
        if (obj.status === 2) {
          isEmployee = true;
        }
        if (obj.status < 2) {
          openApplications++;
        }
        return obj.jobId;
      });
      console.log(buttonutils);
      if (this.state.sort === "slth") {
        alljobs.sort((a, b) => a.salary - b.salary);
      } else if (this.state.sort === "shtl") {
        alljobs.sort((a, b) => b.salary - a.salary);
      } else if (this.state.sort === "dlth") {
        alljobs.sort((a, b) => a.duration - b.duration);
      } else if (this.state.sort === "dhtl") {
        alljobs.sort((a, b) => b.duration - a.duration);
      } else if (this.state.sort === "rlth") {
        alljobs.sort(function (a, b) {
          const x =
            a.rating.people === 0 ? 0 : a.rating.sumofratings / a.rating.people;
          const y =
            b.rating.people === 0 ? 0 : b.rating.sumofratings / b.rating.people;
          return x - y;
        });
      } else if (this.state.sort === "rhtl") {
        alljobs.sort(function (a, b) {
          const x =
            a.rating.people === 0 ? 0 : a.rating.sumofratings / a.rating.people;
          const y =
            b.rating.people === 0 ? 0 : b.rating.sumofratings / b.rating.people;
          return y - x;
        });
      }
      console.log(alljobs);
      let present1 = Date.now();
      present1 += 19800000;
      console.log(present1);
      alljobs = alljobs.filter(function (ele) {
        var wqd = new Date(ele.applicationDeadline);
        var result = wqd.getTime();
        console.log(result);
        return result > present1;
      });
      allJobs = alljobs.map((jobq) => {
        let comptoshow = (
          <td>
            <ButtonToolbar className="md-4">
              <Button
                variant="primary"
                onClick={() =>
                  this.setState({ jobid: jobq._id }, () =>
                    this.setState({ addModalShow: true })
                  )
                }
              >
                Apply
              </Button>
            </ButtonToolbar>
          </td>
        );
        if (isEmployee) {
          comptoshow = cannotApplybutton;
        }
        if (applied.includes(jobq._id)) {
          comptoshow = appliedbutton;
        } else {
          var idx = buttonutils.findIndex((obj) => obj.jobId === jobq._id);
          console.log(idx);
          if (idx >= 0) {
            console.log(buttonutils[idx].numberOfApplications);
            if (
              buttonutils[idx].numberOfApplications ===
                jobq.maxNumOfApplications ||
              buttonutils[idx].numberOfPos === jobq.maxNumOfPositions
            ) {
              comptoshow = exceedbutton;
            }
          }
        }
        if (jobq.title.includes(this.state.search))
          return (
            <tr key={jobq._id}>
              <td>{jobq.title}</td>
              <td>{jobq.user.name}</td>
              <td>
                {jobq.rating.people === 0
                  ? 0
                  : jobq.rating.sumofratings / jobq.rating.people}
              </td>
              <td>{jobq.salary}</td>
              <td>{jobq.duration}</td>
              <td>{jobq.applicationDeadline}</td>
              {comptoshow}
            </tr>
          );
      });
    }
    return (
      <div>
        <h4 className="mb-4">Active Job Listings</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Search</th>
              <th>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search By Title"
                  name="search"
                  value={this.state.search}
                  onChange={this.onSearchChange}
                />
              </th>
              <th>Sort</th>
              <th>
                <select
                  type="text"
                  className="form-control form-control-lg"
                  value={this.state.sort}
                  onChange={this.onSortChange}
                >
                  <option value="none">None</option>
                  <option value="slth">Salary (Low To High)</option>
                  <option value="shtl">Salary (High To Low)</option>
                  <option value="dlth">Duration (Low To High)</option>
                  <option value="dhtl">Duration (High To Low)</option>
                  <option value="rlth">Rating (Low To High)</option>
                  <option value="rhtl">Rating (High To Low)</option>
                </select>
              </th>
              <th>Filter</th>
              <th>
                <select
                  type="text"
                  className="form-control form-control-lg"
                  value={this.state.filter}
                  onChange={this.onFilterChange}
                >
                  <option value="none">None</option>
                  <option value="jobtype">Job Type</option>
                  <option value="salary">Salary</option>
                  <option value="duration">Duration</option>
                </select>
              </th>
              {filterOptions}
            </tr>
          </thead>
        </table>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Recruiter Name</th>
              <th>Job Rating</th>
              <th>Salary</th>
              <th>Duration</th>
              <th>Deadline Of Application</th>
            </tr>
            {allJobs}
          </thead>
        </table>
        <ApplySop
          initial={this.state.jobid}
          initial1={openApplications}
          show={this.state.addModalShow}
          onHide={addModalClose}
        />
      </div>
    );
  }
}

JobListings.propTypes = {
  auth: PropTypes.object.isRequired,
  job: PropTypes.object.isRequired,
  fetchAllJobs: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  job: state.job,
  profile: state.profile,
});

export default connect(mapStateToProps, { fetchAllJobs, getCurrentProfile })(
  JobListings
);
