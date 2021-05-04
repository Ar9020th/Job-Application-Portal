import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
class ViewSOP extends Component {
  constructor(props) {
    super(props);
    console.log(props.initial);
    this.state = {
      sop: props.initial,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initial !== this.props.initial) {
      console.log(this.props.initial);
      this.setState({
        sop: this.props.initial,
      });
    }
  }
  render() {
    let pageContent = null;
    if (this.state.sop !== undefined) {
      pageContent = <h4>{this.state.sop}</h4>;
    }
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Show SOP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <h4 className="mb-4">SOP of applicant</h4>
            {pageContent}
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

export default ViewSOP;
