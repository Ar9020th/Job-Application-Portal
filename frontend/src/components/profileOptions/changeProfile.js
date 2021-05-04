import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { updateProfile } from "../../actions/profileActions";
import { withRouter } from "react-router";
import { updateUser } from "../../actions/authActions";
class ChangeProfile extends Component {
  constructor(props) {
    super(props);
    const usertype = this.props.auth.user.usertype;
    if (usertype === "applicant") {
      this.state = {
        name: this.props.profile.profile.user.name,
        email: this.props.profile.profile.user.email,
        skills: this.props.profile.profile.skills.join(","),
        errors: {},
        showMes: false,
      };
    } else {
      this.state = {
        name: this.props.profile.profile.user.name,
        email: this.props.profile.profile.user.email,
        contactno: this.props.profile.profile.contactno,
        bio: this.props.profile.profile.bio,
        errors: {},
        showMes: false,
      };
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const usertype = this.props.auth.user.usertype;
    let e1, e2, e3, e4;
    e1 = this.state.errors.name !== undefined ? this.state.errors.name : "";
    e2 = this.state.errors.email !== undefined ? this.state.errors.email : "";
    if (usertype === "applicant") {
      e3 =
        this.state.errors.skills !== undefined ? this.state.errors.skills : "";
    } else {
      e3 =
        this.state.errors.contactno !== undefined
          ? this.state.errors.contactno
          : "";
      e4 = this.state.errors.bio !== undefined ? this.state.errors.bio : "";
    }
    if (usertype === "applicant") {
      if (nextProps.errors.name) {
        this.setState({
          errors: {
            name: nextProps.errors.name,
            email: e2,
            skills: e3,
          },
        });
        e1 = nextProps.errors.name;
      }
      if (nextProps.errors.email) {
        this.setState({
          errors: {
            name: e1,
            email: nextProps.errors.email,
            skills: e3,
          },
        });
      }
      if (nextProps.errors.skills) {
        this.setState({
          errors: {
            name: e1,
            email: e2,
            skills: nextProps.errors.skills,
          },
        });
      }
    } else {
      if (nextProps.errors.name) {
        this.setState({
          errors: {
            name: nextProps.errors.name,
            email: e2,
            contactno: e3,
            bio: e4,
          },
        });
        e1 = nextProps.errors.name;
      }
      if (nextProps.errors.email) {
        this.setState({
          errors: {
            name: e1,
            email: nextProps.errors.email,
            contactno: e3,
            bio: e4,
          },
        });
      }
      if (nextProps.errors.contactno) {
        this.setState({
          errors: {
            name: e1,
            email: e2,
            contactno: nextProps.errors.contactno,
            bio: e4,
          },
        });
        e3 = nextProps.errors.contactno;
      }
      if (nextProps.errors.bio) {
        this.setState({
          errors: {
            name: e1,
            email: e2,
            contactno: e3,
            bio: nextProps.errors.bio,
          },
        });
      }
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  async onSubmit(e) {
    e.preventDefault();
    this.setState({ errors: {} });
    const usertype = this.props.auth.user.usertype;
    const userData = {
      name: this.state.name,
      email: this.state.email,
    };
    const fer = await this.props.updateUser(userData);
    if (usertype === "applicant") {
      const profileData = {
        skills: this.state.skills,
      };
      profileData.rating = {};
      profileData.rating.sumofratings = this.props.profile.profile.rating.sumofratings;
      profileData.rating.people = this.props.profile.profile.rating.people;
      profileData.rating.applied = this.props.profile.profile.applied;
      const dodo = await this.props.updateProfile(profileData, usertype);
      if (dodo && fer) {
        this.setState({ showMes: true });
      } else {
        this.setState({ showMes: false });
      }
    } else {
      const profileData = {
        contactno: this.state.contactno,
        bio: this.state.bio,
      };
      const dodo = await this.props.updateProfile(profileData, usertype);
      if (dodo && fer) {
        this.setState({ showMes: true });
      } else {
        this.setState({ showMes: false });
      }
    }
    // this.componentWillUnmount();
  }
  render() {
    const { errors } = this.state;
    let pageContent;
    const usertype = this.props.auth.user.usertype;
    if (usertype === "applicant") {
      pageContent = (
        <form onSubmit={this.onSubmit}>
          <h4>Change Name</h4>
          <div className="form-group">
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.name,
              })}
              placeholder="Name"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
            <small className="form-text text-muted"></small>
          </div>
          <div className="form-group">
            <h4>Change Email</h4>
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.email,
              })}
              placeholder="Email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
            <small className="form-text text-muted"></small>
          </div>
          <div className="form-group">
            <h4>Change Skills</h4>
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.skills,
              })}
              placeholder="Add Skills"
              name="skills"
              value={this.state.skills}
              onChange={this.onChange}
            />
            {errors.skills && (
              <div className="invalid-feedback">{errors.skills}</div>
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
    } else {
      pageContent = (
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <h4>Change Name</h4>
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.name,
              })}
              placeholder="Name"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
            <small className="form-text text-muted"></small>
          </div>
          <div className="form-group">
            <h4>Change Email</h4>
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.email,
              })}
              placeholder="Email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
            <small className="form-text text-muted"></small>
          </div>
          <div className="form-group">
            <h4>Change Contact Number</h4>
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.contactno,
              })}
              placeholder="Contact Number"
              name="contactno"
              value={this.state.contactno}
              onChange={this.onChange}
            />
            {errors.contactno && (
              <div className="invalid-feedback">{errors.contactno}</div>
            )}
            <small className="form-text text-muted"></small>
          </div>
          <div className="form-group">
            <h4>Change Bio</h4>
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.bio,
              })}
              placeholder="Bio(not more than 250 characters)"
              name="bio"
              value={this.state.bio}
              onChange={this.onChange}
            />
            {errors.bio && <div className="invalid-feedback">{errors.bio}</div>}
            <small className="form-text text-muted"></small>
          </div>
          <input
            type="submit"
            value="Submit"
            className="btn btn-info btn-block mt-4"
          />
        </form>
      );
    }
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
          <Button
            variant="danger"
            onClick={() => {
              this.props.onHide();
              this.setState({ showMes: false, errors: {} });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ChangeProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
  auth: state.auth,
});

export default connect(mapStateToProps, { updateProfile, updateUser })(
  withRouter(ChangeProfile)
);
