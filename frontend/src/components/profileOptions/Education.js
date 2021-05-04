import React, { Component } from "react";
class Education extends Component {
  render() {
    const education = this.props.education.map((edu) => (
      <tr key={edu._id}>
        <td>{edu.institution_name}</td>
        <td>{edu.startdate}</td>
        <td>{edu.enddate}</td>
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
      </div>
    );
  }
}

export default Education;
