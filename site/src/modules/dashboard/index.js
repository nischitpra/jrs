import React from 'react'

import CeoDashboard from './ceoDashboard'
import HrDashboard from './hrDashboard'

export default class Dashboard extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {}
  }

  componentWillMount() {
    this.setRenderContent()
  }
  
  setRenderContent() {
    let content = <div></div>
    switch( this.props.position ) {
      case 'CEO':
        content = <CeoDashboard/>
        break
      case  'HR':
        content = <HrDashboard/>
    }
    this.setState({ renderContent: content })
  }
  
  render() {
    return (
      <div>
        { this.state.renderContent }
      </div>
    )
  }

}