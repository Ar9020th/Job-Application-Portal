import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";
class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );
    let authLinks;
    if (user.usertype === "applicant") {
      authLinks = (
        <ul className="navbar-nav mr-auto">
          <Link className="nav-link" to="/edit-profile">
            Profile Options
          </Link>
          <li className="nav-item">
            <Link className="nav-link" to="/job-listings">
              Job Listings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/my-applications">
              My Applications
            </Link>
          </li>
          <li className="nav-item">
            <a
              href="#"
              onClick={this.onLogoutClick.bind(this)}
              className="nav-link"
            >
              Logout
            </a>
          </li>
        </ul>
      );
    } else {
      authLinks = (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/edit-profile">
              Profile Options
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/my-jobs">
              My Jobs
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/create-job-listings">
              Create Job Listings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/employees-accepted">
              Employees Accepted
            </Link>
          </li>
          <li className="nav-item">
            <a
              href="#"
              onClick={this.onLogoutClick.bind(this)}
              className="nav-link"
            >
              Logout
            </a>
          </li>
        </ul>
      );
    }
    return (
      <nav
        collapseOnSelect
        className="container-fluid navbar navbar-expand-sm navbar-dark bg-dark mb-4"
      >
        <div className="container">
          <Link className="navbar-brand" to="/">
            HomePage
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(
  Navbar
);
