import React, {Component} from "react"
import PropTypes from 'prop-types';
import classNames from "classnames"
import _ from "lodash"
import {connect} from "react-redux"
import ReactModal from "react-modal"

import {closeModal} from "actions/modalActions"

require('./Modal.scss')

ReactModal.setAppElement('#modals')

@connect(state => ({
  openModal: state.modal.get('open')
}))
class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  static propTypes = {
    component: PropTypes.func,
    id: PropTypes.string,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    onClose: _.noOp
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }

  getClassName() {
    return classNames(
      "Modal", this.props.className
    )
  }

  getStyles() {
    return {
      overlay: {
        backgroundColor: "rgba(0,0,0,0.8)"
      }
    }
  }

  renderComponent() {
    let Component = this.props.component
    return <Component />
  }

  onClose = () => {
    this.props.dispatch(closeModal())
    if (_.isFunction(this.props.onClose)) this.props.onClose()
  }

  render() {
    let {id, openModal} = this.props
    let {hasError} = this.state
    let isOpen = openModal === id

    if (hasError) return null

    return isOpen && <ReactModal
          className={this.getClassName()}
          isOpen={isOpen}
          onRequestClose={this.onClose}
          style={this.getStyles()}
          contentLabel="Modal"
        >
          <div className="Modal__close" onClick={this.onClose}>✕</div>
          <div className="Modal__container">
            {this.renderComponent()}
          </div>
        </ReactModal>
  }
}

export default Modal
