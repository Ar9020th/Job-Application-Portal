import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import Moment from "moment";
import { updateJob } from "../../actions/jobActions";
class EditJob extends Component {
  constructor(props) {
    super(props);
    console.log(props.initial);
    this.state = {
      id: props.initial._id,
      maxNumOfApplicants: props.initial.maxNumOfApplications,
      maxNumOfPositions: props.initial.maxNumOfPositions,
      applicationDeadline: props.initial.applicationDeadline,
      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initial !== this.props.initial) {
      this.setState({
        id: this.props.initial._id,
        maxNumOfApplicants: this.props.initial.maxNumOfApplications,
        maxNumOfPositions: this.props.initial.maxNumOfPositions,
        applicationDeadline: Moment(
          this.props.initial.applicationDeadline
        ).format("YYYY-MM-DD"),
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  async onSubmit(e) {
    e.preventDefault();
    this.setState({ errors: {} });
    const jobData = {
      id: this.state.id,
      maxNumOfApplications: this.state.maxNumOfApplicants,
      maxNumOfPositions: this.state.maxNumOfPositions,
      applicationDeadline: this.state.applicationDeadline,
    };
    const f = await this.props.updateJob(jobData);
    if (f == 1) {
      this.props.onHide();
    }
  }
  render() {
    const { errors } = this.state;
    console.log(this.props.initial);
    let pageContent;
    pageContent = (
      <form onSubmit={this.onSubmit}>
        <h4>Maximum Number of Applicants</h4>
        <div className="form-group">
          <input
            type="number"
            className={classnames("form-control form-control-lg", {
              "is-invalid": errors.maxNumOfApplicants,
            })}
            placeholder="Institution Name"
            name="maxNumOfApplicants"
            value={this.state.maxNumOfApplicants}
            onChange={this.onChange}
          />
          {errors.maxNumOfApplicants && (
            <div className="invalid-feedback">{errors.maxNumOfApplicants}</div>
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
            placeholder="Start Year"
            name="maxNumOfPositions"
            value={this.state.maxNumOfPositions}
            onChange={this.onChange}
          />
          {errors.maxNumOfPositions && (
            <div className="invalid-feedback">{errors.maxNumOfPositions}</div>
          )}
          <small className="form-text text-muted"></small>
        </div>
        <div className="form-group">
          <h4>Deadline for Application</h4>
          <input
            type="date"
            className={classnames("form-control form-control-lg", {
              "is-invalid": errors.applicationDeadline,
            })}
            placeholder="End Year"
            name="applicationDeadline"
            value={this.state.applicationDeadline}
            onChange={this.onChange}
          />
          {errors.applicationDeadline && (
            <div className="invalid-feedback">{errors.applicationDeadline}</div>
          )}
          <small className="form-text text-muted"></small>
        </div>
        <input
          type="submit"
          value="Submit"
          className="btn btn-info btn-block mt-4"
        />
      </form>
    );
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">{pageContent}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

EditJob.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  updateJob: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
});

export default connect(mapStateToProps, { updateJob })(EditJob);
