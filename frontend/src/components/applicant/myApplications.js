import React, { Component } from "react";
import StarRating from "../common/StarRating";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import { applicationsData } from "../../actions/jobActions";
class MyApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
    };
  }
  async componentDidMount() {
    const usertype = this.props.auth.user.usertype;
    this.props.getCurrentProfile(usertype);
    const f = await applicationsData();
    console.log(f);
    this.setState({ applications: f });
  }
  render() {
    let myApplicationFields = this.state.applications.map((edu) => (
      <tr key={edu.jobId}>
        <td>{edu.title}</td>
        <td>
          {edu.dateOfJoining !== undefined
            ? edu.dateOfJoining
            : "Wait for Acceptance"}
        </td>
        <td>{edu.salary}</td>
        <td>{edu.recruitername}</td>
        <td>
          {edu.status === 2 ? (
            <StarRating
              initialRating={edu.rating}
              ratingtype="job"
              id1={edu.jobId}
              id2={this.props.auth.user.id}
            />
          ) : (
            "Cannot Rate"
          )}
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Active Job Listings</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date Of Joining</th>
              <th>Salary per month</th>
              <th>Name of recruiter</th>
              <th>Rate the Job (For Employees only)</th>
            </tr>
            {myApplicationFields}
          </thead>
        </table>
      </div>
    );
  }
}

MyApplications.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  job: state.job,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(MyApplications);
