import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { submitApplication } from "../../actions/jobActions";
class ApplySop extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      id: props.initial,
      openApplications: props.initial1,
      sop: "",
      errors: {},
      disable: false,
      showMes: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeSOP = this.onChangeSOP.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initial !== this.props.initial) {
      console.log(this.props.initial);
      this.setState({
        id: this.props.initial,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onChangeSOP(e) {
    let st = e.target.value.split(" ");
    const now = st.length;
    console.log(now);
    if (now >= 250) {
      st.splice(250, now - 249);
    }
    const newsop = st.join(" ");
    this.setState({ sop: newsop });
  }
  async onSubmit(e) {
    e.preventDefault();
    this.props.onHide();
    const obj = {
      id: this.state.id,
      sop: this.state.sop,
      status: 0,
    };
    this.props.submitApplication(obj);
  }
  render() {
    const { errors } = this.state;
    let pageContent;
    console.log(this.state.openApplications);
    if (this.state.openApplications < 10) {
      console.log("adwdaw");
      pageContent = (
        <form onSubmit={this.onSubmit}>
          <h4>Statement Of Purpose</h4>
          <div className="form-group">
            <textarea
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.sop,
              })}
              placeholder="Statement Of Purpose(Not more than 250 words)"
              name="sop"
              disabled={this.state.disable}
              value={this.state.sop}
              rows="9"
              onChange={this.onChangeSOP}
            />
            {errors.sop && <div className="invalid-feedback">{errors.sop}</div>}
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
      pageContent = <h4>Open applications cannot exceed 10</h4>;
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
            {this.state.openApplications < 10
              ? "Statement Of Purpose"
              : "Alert"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">{pageContent}</div>
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

ApplySop.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  submitApplication: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
});

export default connect(mapStateToProps, { submitApplication })(ApplySop);
