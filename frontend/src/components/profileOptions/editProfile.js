import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonToolbar } from "react-bootstrap";
import ChangeProfile from "./changeProfile";
import AddEducation from "./addEducation";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getCurrentProfile } from "../../actions/profileActions";
import EditEducation from "../profileOptions/editEducation";
import Education from "./Education";
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { addModal1Show: false, addModal2Show: false };
  }
  componentDidMount() {
    const usertype = this.props.auth.user.usertype;
    this.props.getCurrentProfile(usertype);
  }
  render() {
    let addModalClose = () =>
      this.setState({ addModal1Show: false, addModal2Show: false });
    const { profile, loading } = this.props.profile;
    let epContent;
    if (profile == null || loading) {
      epContent = <Spinner />;
    } else {
      if (this.props.auth.user.usertype === "applicant") {
        epContent = (
          <div>
            <ButtonToolbar className="md-4">
              <Button
                variant="primary"
                onClick={() => this.setState({ addModal1Show: true })}
              >
                Edit Profile
              </Button>
              <ChangeProfile
                show={this.state.addModal1Show}
                onHide={addModalClose}
              />
            </ButtonToolbar>
            <ButtonToolbar>
              <Button
                variant="primary"
                onClick={() => this.setState({ addModal2Show: true })}
              >
                Add Education
              </Button>
              <AddEducation
                show={this.state.addModal2Show}
                onHide={addModalClose}
              />
            </ButtonToolbar>
            <EditEducation education={profile.education} />
          </div>
        );
      } else {
        epContent = (
          <div>
            <ButtonToolbar className="md-4">
              <Button
                variant="primary"
                onClick={() => this.setState({ addModal1Show: true })}
              >
                Edit Profile
              </Button>
              <ChangeProfile
                show={this.state.addModal1Show}
                onHide={addModalClose}
              />
            </ButtonToolbar>
          </div>
        );
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Edit Your Profile</h1>
              {epContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditProfile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentProfile })(EditProfile);
