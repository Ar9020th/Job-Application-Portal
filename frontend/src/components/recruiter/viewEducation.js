import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
class ViewEducation extends Component {
  constructor(props) {
    super(props);
    console.log(props.initial);
    this.state = {
      education: props.initial,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initial !== this.props.initial) {
      console.log(this.props.initial);
      this.setState({
        education: this.props.initial,
      });
    }
  }
  render() {
    let pageContent = null;
    if (this.state.education !== undefined) {
      pageContent = this.state.education.map((obj) => (
        <tr key={obj._id}>
          <td>{obj.institution_name}</td>
          <td>{obj.startdate}</td>
          <td>{obj.enddate}</td>
        </tr>
      ));
    }
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
          <div className="container">
            <h4 className="mb-4">Education Credentials</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Institution Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
                {pageContent}
              </thead>
            </table>
          </div>
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

export default ViewEducation;
