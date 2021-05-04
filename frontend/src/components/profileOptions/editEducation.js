import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteEducation } from "../../actions/profileActions";
import EditEducationField from "./editEducationField";
import { Button, ButtonToolbar } from "react-bootstrap";
class EditEducation extends Component {
  constructor(props) {
    super(props);
    this.state = { addModalShow: false, edu: {} };
  }
  onDeleteClick(id) {
    this.props.deleteEducation(id);
  }
  render() {
    let addModalClose = () => this.setState({ addModalShow: false });
    const education = this.props.education.map((edu) => (
      <tr key={edu._id}>
        <td>{edu.institution_name}</td>
        <td>{edu.startdate}</td>
        <td>{edu.enddate}</td>
        <td>
          <ButtonToolbar className="md-4">
            <Button
              variant="primary"
              onClick={() => {
                this.setState({ edu: edu }, () =>
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
            onClick={this.onDeleteClick.bind(this, edu._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Education Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Institution Name</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
            {education}
          </thead>
        </table>
        <EditEducationField
          initial={this.state.edu}
          show={this.state.addModalShow}
          onHide={addModalClose}
        />
      </div>
    );
  }
}

EditEducation.propTypes = {
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(EditEducation);
