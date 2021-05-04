import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { addEducation } from "../../actions/profileActions";
class AddEducation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      institution_name: "",
      startdate: "",
      enddate: "",
      errors: {},
      showMes: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
    const educationData = {
      institution_name: this.state.institution_name,
      startdate: parseInt(this.state.startdate),
      enddate: this.state.enddate === "" ? 0 : parseInt(this.state.enddate),
    };
    console.log(educationData);
    const f = await this.props.addEducation(educationData);
    if (f == 1) {
      this.props.onHide();
    }
  }
  render() {
    const { errors } = this.state;
    let pageContent;
    pageContent = (
      <form onSubmit={this.onSubmit}>
        <h4>Institution Name</h4>
        <div className="form-group">
          <input
            type="text"
            className={classnames("form-control form-control-lg", {
              "is-invalid": errors.institution_name,
            })}
            placeholder="Institution Name"
            name="institution_name"
            value={this.state.institution_name}
            onChange={this.onChange}
          />
          {errors.institution_name && (
            <div className="invalid-feedback">{errors.institution_name}</div>
          )}
          <small className="form-text text-muted"></small>
        </div>
        <div className="form-group">
          <h4>Start Year</h4>
          <input
            type="number"
            min={1900}
            max={2100}
            className={classnames("form-control form-control-lg", {
              "is-invalid": errors.startdate,
            })}
            placeholder="Start Year"
            name="startdate"
            value={this.state.startdate}
            onChange={this.onChange}
          />
          {errors.startdate && (
            <div className="invalid-feedback">{errors.startdate}</div>
          )}
          <small className="form-text text-muted"></small>
        </div>
        <div className="form-group">
          <h4>End Year</h4>
          <input
            type="number"
            min={1900}
            max={2100}
            className={classnames("form-control form-control-lg", {
              "is-invalid": errors.enddate,
            })}
            placeholder="End Year"
            name="enddate"
            value={this.state.enddate}
            onChange={this.onChange}
          />
          {errors.enddate && (
            <div className="invalid-feedback">{errors.enddate}</div>
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
    const successMessage = <h4>Successfully Submitted</h4>;
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
          {this.state.showMes ? successMessage : ""}
          <Button variant="danger" onClick={this.props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AddEducation.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addEducation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
  auth: state.auth,
});

export default connect(mapStateToProps, { addEducation })(AddEducation);
