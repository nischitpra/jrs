import React from 'react'

class IconInput extends React.Component {
  constructor( props ) {
    super( props )
  }

  render() {
    return (
      <div className='iconInput-container'>
        <img src='/favicon.ico'/>
        <input
          placeholder={ this.props.placeholder } 
          onChange={ this.props.onChange }
          value={ this.props.value }
          type={ this.props.type }
          />
      </div>
    )
  }
}

export default IconInput