import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/dashboard";
import CreateProfile from "./components/create-profile/CreateProfile";
import JobListings from "./components/applicant/jobListings";
import MyApplications from "./components/applicant/myApplications";
import MyJobs from "./components/recruiter/myJobs";
import CreateJobListings from "./components/recruiter/createJobListings";
import EmployeesAccepted from "./components/recruiter/employeesAccepted";
import ViewApplications from "./components/recruiter/viewApplications";
import EditProfile from "./components/profileOptions/editProfile";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { logoutUser, setCurrentUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";
import PrivateRoute from "./components/common/PrivateRoute";
if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  const currenttime = Date.now() / 1000;
  if (decoded.exp < currenttime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    window.location.href = "/login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/job-listings"
                  component={JobListings}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/my-applications"
                  component={MyApplications}
                />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/my-jobs" component={MyJobs} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-job-listings"
                  component={CreateJobListings}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/employees-accepted"
                  component={EmployeesAccepted}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={EditProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/viewallapplications"
                  component={ViewApplications}
                />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
