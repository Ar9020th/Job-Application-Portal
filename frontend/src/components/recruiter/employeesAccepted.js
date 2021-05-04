import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import StarRating from "../common/StarRating";
import { employeesAcceptedData } from "../../actions/jobActions";
import Spinner from "../common/Spinner";
class EmployeesAccepted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: "None",
    };
    this.onSortChange = this.onSortChange.bind(this);
  }
  onSortChange(e) {
    this.setState({ sort: e.target.value });
  }
  componentDidMount() {
    this.props.employeesAcceptedData();
  }
  getRating(apid, arr) {
    const obj = arr.find((ele) => ele.id === apid);
    return obj.rating;
  }
  render() {
    let pageContent;
    let { acceptedEmployees, loading, allRatings } = this.props.job;
    if (this.state.sort === "dlth") {
      acceptedEmployees.sort(function (a, b) {
        if (a.dateOfJoining < b.dateOfJoining) {
          return -1;
        } else if (a.dateOfJoining === b.dateOfJoining) return 0;
        else return 1;
      });
    } else if (this.state.sort === "dhtl") {
      acceptedEmployees.sort(function (a, b) {
        if (a.dateOfJoining < b.dateOfJoining) {
          return 1;
        } else if (a.dateOfJoining === b.dateOfJoining) return 0;
        else return -1;
      });
    } else if (this.state.sort === "nlth") {
      console.log("wdawqe");
      acceptedEmployees.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        } else if (a.name.toLowerCase() === b.name.toLowerCase()) return 0;
        else return 1;
      });
    } else if (this.state.sort === "nhtl") {
      acceptedEmployees.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return 1;
        } else if (a.name.toLowerCase() === b.name.toLowerCase()) return 0;
        else return -1;
      });
    } else if (this.state.sort === "jlth") {
      acceptedEmployees.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1;
        } else if (a.title.toLowerCase() === b.title.toLowerCase()) return 0;
        else return 1;
      });
    } else if (this.state.sort === "jhtl") {
      acceptedEmployees.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return 1;
        } else if (a.title.toLowerCase() === b.title.toLowerCase()) return 0;
        else return -1;
      });
    } else if (this.state.sort === "alth") {
      acceptedEmployees.sort(function (a, b) {
        return a.rating - b.rating;
      });
    } else if (this.state.sort === "ahtl") {
      acceptedEmployees.sort(function (a, b) {
        return b.rating - a.rating;
      });
    }
    if ((acceptedEmployees === null) | loading) {
      pageContent = <Spinner />;
    } else {
      let accEmployees = [];
      acceptedEmployees = acceptedEmployees.forEach((ele) => {
        let obj = ele;
        obj.rating = this.getRating(ele.id, allRatings);
        console.log(obj);
        accEmployees.push(obj);
      });
      acceptedEmployees = accEmployees;
      pageContent = acceptedEmployees.map((ele) => (
        <tr>
          <td>{ele.name}</td>
          <td>{ele.dateOfJoining}</td>
          <td>{ele.typeOfJob}</td>
          <td>{ele.title}</td>
          <td>{ele.rating}</td>
          <td>
            <StarRating
              initialRating={ele.initrating}
              ratingtype="applicant"
              id1={ele.id}
              id2={ele.jobId}
            />
          </td>
        </tr>
      ));
    }
    return (
      <div>
        <h4 className="mb-4">Accepted Employees</h4>
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
                  <option value="jlth">Job Title (Low To High)</option>
                  <option value="jhtl">Job Title (High To Low)</option>
                  <option value="dlth">Date Of Joining (Low To High)</option>
                  <option value="dhtl">Date Of Joining (High To Low)</option>
                  <option value="alth">Applicant's Rating (Low To High)</option>
                  <option value="ahtl">Applicant's Rating (High To Low)</option>
                </select>
              </th>
            </tr>
            <tr>
              <th>Name</th>
              <th>Date Of Joining</th>
              <th>Job Type</th>
              <th>Job Title</th>
              <th>Applicant Rating</th>
              <th>Rate the Job (For Employees only)</th>
            </tr>
            {pageContent}
          </thead>
        </table>
      </div>
    );
  }
}

EmployeesAccepted.propTypes = {
  auth: PropTypes.object.isRequired,
  job: PropTypes.object.isRequired,
  employeesAcceptedData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  job: state.job,
});

export default connect(mapStateToProps, { employeesAcceptedData })(
  EmployeesAccepted
);
