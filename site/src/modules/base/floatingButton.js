import React from 'react'

class FloatingButton extends React.Component {
  constructor( props ) {
    super( props )
  }

  render() {
    return (
      <div className='floatingButton-container'>
        <button onClick={ this.props.onClick }>
          <img src={ this.props.icon } />
        </button>
      </div>
    )
  }
}

export default FloatingButton