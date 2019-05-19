import React from 'react'
import ChangePassword from './changePassword'

import interactor from './interactor'

class Profile extends React.Component {
  constructor( props ) {
    super( props )
    this.state={}

    this.renderProfileData = this.renderProfileData.bind( this )
  }

  componentWillMount() {
    const cb = ( data )=>{
      this.setState({
        profile: data
      })
    }
    interactor.getProfileDetails( cb )
  }

  renderProfileData() {
    if( !this.state.profile ) return
    
    return (
      <div>
        { this.state.profile.personalDetails && (
          <div>
            Email: { this.state.profile.personalDetails.email }<br/>
            Department: { this.state.profile.personalDetails.department }<br/>
            Position: { this.state.profile.personalDetails.position }<br/>
            Age: { this.state.profile.personalDetails.age }<br/>
            Sex: { this.state.profile.personalDetails.sex }<br/>
          </div>
        )}
        {
          this.state.profile.immediateBossDetails && (
          <div>
            Boss<br/>
            Name: { this.state.profile.immediateBossDetails.name }<br/>
            Email: { this.state.profile.immediateBossDetails.email }<br/>
            Department: { this.state.profile.immediateBossDetails.department }<br/>
            Position: { this.state.profile.immediateBossDetails.position }<br/>
          </div>
          )
        }
        
      </div>
    ) 
  }

  render() {
    return (
      <div>
        { this.renderProfileData() }
        <button onClick={ ()=>{ this.setState({ renderContent: <ChangePassword/> })} }>Change Password</button>
        { this.state.renderContent }
      </div>
    )
  }
}




export default Profile