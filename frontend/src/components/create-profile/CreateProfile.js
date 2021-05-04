import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { createProfile } from "../../actions/profileActions";
import { withRouter } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
class CreateProfile extends Component {
  constructor(props) {
    super(props);
    const usertype = this.props.auth.user.usertype;
    if (usertype === "applicant") {
      this.state = {
        skills: [],
        allLanguages: [
          "Select",
          "html",
          "css",
          "javascript",
          "mysql",
          "C++",
          "C",
          "Java",
          "Python",
          "Flutter",
          "Dart",
          "React",
          "React-Native",
          "Angular",
          "TypeScript",
          "BootStrap",
        ],
        type: "Select any language",
        errors: {},
        skillsAddOn: "",
      };
    } else {
      this.state = {
        contactno: "",
        bio: "",
        errors: {},
      };
    }
    this.onChange = this.onChange.bind(this);
    this.onChangeBio = this.onChangeBio.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangesoa = this.onChangesoa.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const usertype = this.props.auth.user.usertype;
    if (usertype === "applicant") {
      let profileData = {
        skills: this.state.skills.join(","),
      };
      profileData.rating = {};
      profileData.rating.sumofratings = 0;
      profileData.rating.people = 0;
      profileData.applied = [];
      this.props.createProfile(profileData, this.props.history, usertype);
    } else {
      const profileData = {
        contactno: this.state.contactno,
        bio: this.state.bio,
      };
      this.props.createProfile(profileData, this.props.history, usertype);
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onChangesoa(e) {
    this.setState({ skillsAddOn: e.target.value });
  }
  onChangeType(e) {
    let arr = this.state.allLanguages;
    arr.splice(arr.indexOf(e.target.value), 1);
    let arr1 = this.state.skills;
    arr1.push(e.target.value);
    this.setState({
      type: "Select",
      allLanguages: arr,
      skills: arr1,
    });
  }
  rmskill(ele) {
    let arr = this.state.skills;
    arr.splice(arr.indexOf(ele), 1);
    let arr1 = this.state.allLanguages;
    arr1.push(ele);
    this.setState({ skills: arr, allLanguages: arr1 });
  }
  addSkill() {
    if (this.state.skillsAddOn === "") {
      return;
    }
    let arr = this.state.skills;
    let arr1 = this.state.skillsAddOn.split(",");
    console.log(arr1);
    arr.push(...arr1);
    this.setState({ skills: arr });
  }
  onChangeBio(e) {
    let st = e.target.value.split(" ");
    const now = st.length;
    console.log(now);
    if (now >= 250) {
      st.splice(250, now - 249);
    }
    const newbio = st.join(" ");
    this.setState({ bio: newbio });
  }
  render() {
    const { errors } = this.state;
    let pageContent;
    const usertype = this.props.auth.user.usertype;
    if (usertype === "applicant") {
      pageContent = (
        <Container>
          <Row>
            <Col>
              <h6>Your Skills</h6>
              {this.state.skills.map((ele) => (
                <Row>
                  <Col>
                    <h6>{ele}</h6>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-danger"
                      onClick={() => this.rmskill(ele)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
            </Col>
            <Col>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <h6>Select Skills:</h6>
                  <select
                    type="text"
                    className="form-control form-control-lg"
                    value={this.state.type}
                    onChange={this.onChangeType}
                  >
                    {this.state.allLanguages.map((ele) => (
                      <option value={ele}>{ele}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.skills,
                    })}
                    placeholder="Add Skills not mentioned above...(comma separated values)"
                    name="addonskills"
                    value={this.state.skillsAddOn}
                    onChange={this.onChangesoa}
                  />
                  {errors.skills && (
                    <div className="invalid-feedback">{errors.skills}</div>
                  )}
                  <small className="form-text text-muted"></small>
                  <Button
                    variant="outline-danger"
                    onClick={() => this.addSkill()}
                  >
                    Add
                  </Button>
                </div>
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </Col>
          </Row>
        </Container>
      );
    } else {
      pageContent = (
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
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
            <textarea
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.bio,
              })}
              placeholder="Bio(not more than 250 characters)"
              name="bio"
              rows="9"
              value={this.state.bio}
              onChange={this.onChangeBio}
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
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">Let's get some information</p>
              <small className="d-block pb-3">* = required fields</small>
              {pageContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
  auth: state.auth,
});

export default connect(mapStateToProps, { createProfile })(
  withRouter(CreateProfile)
);
