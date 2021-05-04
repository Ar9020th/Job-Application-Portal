import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchJobs, deleteJob } from "../../actions/jobActions";
import Spinner from "../common/Spinner";
import { Button, ButtonToolbar } from "react-bootstrap";
import EditJob from "./editJob";
import { Link } from "react-router-dom";
class MyJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModalShow: false,
      jobi: {},
    };
  }
  componentDidMount() {
    this.props.fetchJobs();
  }
  remainingNumberofPositions(applicants, mnop) {
    let pos = 0;
    applicants.forEach((ele) => (ele.status === 2 ? pos++ : null));
    return mnop - pos;
  }
  onDeleteClick(id) {
    this.props.deleteJob(id);
  }
  render() {
    let addModalClose = () => this.setState({ addModalShow: false });
    let myJobs;
    const { myjobs, loading } = this.props.job;
    const editmodal = (
      <EditJob
        initial={this.state.jobi}
        show={this.state.addModalShow}
        onHide={addModalClose}
      />
    );
    if (myjobs === null || loading) {
      myJobs = <Spinner />;
    } else {
      myJobs = myjobs.map((jobq) => (
        <tr key={jobq._id}>
          <td>
            <Link
              className="nav-link"
              to={{
                pathname: "/viewallapplications",
                jobId: jobq._id,
              }}
            >
              {jobq.title}
            </Link>
          </td>
          <td>{jobq.dateOfPosting}</td>
          <td>{jobq.applicants.length}</td>
          <td>
            {this.remainingNumberofPositions(
              jobq.applicants,
              jobq.maxNumOfPositions
            )}
          </td>
          <td>
            <ButtonToolbar className="md-4">
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({ jobi: jobq }, () =>
                    this.setState({ addModalShow: true })
                  );
                }}
              >
                Edit
              </Button>
            </ButtonToolbar>
          </td>
          <td>
            <button
              onClick={this.onDeleteClick.bind(this, jobq._id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      ));
    }
    return (
      <div>
        <h4 className="mb-4">Active Job Listings</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date Of Posting</th>
              <th>Number of Applicants</th>
              <th>Remaining Number of Positions</th>
            </tr>
            {myJobs}
          </thead>
        </table>
        {editmodal}
      </div>
    );
  }
}

MyJobs.propTypes = {
  auth: PropTypes.object.isRequired,
  job: PropTypes.object.isRequired,
  fetchJobs: PropTypes.func.isRequired,
  deleteJob: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  job: state.job,
});

export default connect(mapStateToProps, { fetchJobs, deleteJob })(MyJobs);
