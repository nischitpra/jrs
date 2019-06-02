import React from 'react'

import { sendRequest } from '../../helper/httpHelper'

class UploadPhoto extends React.Component {
  constructor( props ) {
    super( props )
    
    this.state = {}

    this.uploadFile = this.uploadFile.bind( this )
  }

  uploadFile( file ) {
    if( !file ) {
      return alert( 'Could not get file.' ) 
    }
    if( file.size/1024/1024 > 2 ) {
      return alert( 'Maximum image size is 2mb.' )
    }
    
    const reader = new FileReader()
    reader.readAsDataURL( file )
    reader.onloadend = ()=>this.setState({ image: reader.result, status: 'processing' })

    const data = new FormData()
    data.append( this.props.imgKey, file )
    

    const handler = {
      cb: ( data )=>{
        this.setState({ 
          status: 'success', 
        })
        this.props.onSuccess( data.image )
      },
      err: {
        message: 'Could not upload image.',
        cb: ()=>{
          this.setState({
            status: 'error',
            image: '/'// to produce broken image icon
          })
        }
      }
    }

    sendRequest( 'post', this.props.api, data, handler )
  }

  render() {
    return (
      <div className='uploadPhoto-container'>
        <img className={ this.state.status } src={ this.state.image }/>
        <input ref={ input=>this.fileInput=input } hidden='hidden' type='file' onChange={ evt=>this.uploadFile( evt.target.files[0] ) } accept=".jpg, .jpeg, .png"/>
        <button onClick={ ()=>this.fileInput.click() }>{ this.props.btnText }</button>
      </div>
    )
  }

}

export default UploadPhoto