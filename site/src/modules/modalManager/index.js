import React from 'react'

class ModalManager extends React.Component {
    
  constructor( props ) {
    super( props )
    
    this.state = {
      content: undefined
    }

    this.openModal = this.openModal.bind( this )
    this.closeModal = this.closeModal.bind( this )
  }

  _showBackdrop() {
    document.getElementById("modal-container"+this.props.zIndex).className = "enter"
  }
  _hideBackdrop() {
    document.getElementById("modal-container"+this.props.zIndex).className = "exit"
  }

  openModal( content ) {
    this.setState({
      content: content
    }, this._showBackdrop )
  }

  closeModal( evt ) {
    if( evt.target === evt.currentTarget ) {
      this._hideBackdrop() 
      setTimeout(()=>{
        this.setState({
          content: undefined
        })
      }, 250)
    }
  }

  render() {
    if( !this.state.content ) {
      return ""
    }
    
    return(
      <div id={"modal-container"+this.props.zIndex} style={ styles.container } onClick={this.closeModal}>
        <div style={ styles.content }>
          {this.state.content}
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    width: window.innerWidth,
    height: window.innerHeight,
    position: 'fixed',
    backgroundColor: '#00000022',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 100,
  },
  content: {
    width: '500px',
    height: '60%',
    backgroundColor: 'white',
    position: 'relative',
    top: '15%',
    boxShadow: '0px 10px 60px 6px #000000AA'
  }
}

export default ModalManager
