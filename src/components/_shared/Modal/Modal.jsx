import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import ReactModal from "react-modal"

import {closeModal} from "actions/modalActions"

require('./Modal.scss')

@connect(state => ({
  openModal: state.modal.get('open')
}))
class Modal extends Component {
  static propTypes = {
    component: PropTypes.func,
    id: PropTypes.string
  };

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
  }

  render() {
    let {id, openModal} = this.props
    let isOpen = openModal === id

    return isOpen && <ReactModal
          className={this.getClassName()}
          isOpen={isOpen}
          onRequestClose={this.onClose}
          style={this.getStyles()}
        >
          <div className="Modal__close" onClick={this.onClose}>✕</div>
          <div className="Modal__container">
            {this.renderComponent()}
          </div>
        </ReactModal>
  }
}

export default Modal
