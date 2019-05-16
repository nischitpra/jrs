const positionLevel = [
  'CEO',
  'COO',
  'Manager',
  'Employee',
]

const saveRequest = ( employeeDetails, res )=>{
  if( !global.registrationList ) global.registrationList = []

  global.registrationList.push( employeeDetails )
  return res.json({ status: 'OK' })
}
const getRegistrationList = ( res )=>{
  return res.json( global.registrationList )
}
const approve = ( tempId, res )=>{
  console.log( 'tempid', tempId )
  const application = global.registrationList[tempId] 
  if( !global.employeeList ) {
    global.employeeList = { CEO:[{ name:'Lokendra Pradhan', age: 55, sex: 'Male', position: 'CEO' }], COO: [], Manager: [], Employee: [] }
  }
  // find immediate boss
  const applicationPositionIndex = positionLevel.indexOf( application.position )
  for( let i = applicationPositionIndex - 1; i >= 0; i-- ) {
    if( global.employeeList[ positionLevel[i] ].length ) {
      application.immediateBoss = global.employeeList[ positionLevel[i] ][0].name
      break
    }
  }
  // update children immediate boss
  if( applicationPositionIndex + 1 < positionLevel.length ) {
    for( let i = 0; i < global.employeeList[ positionLevel[ applicationPositionIndex + 1 ] ].length; i++ ) {
      global.employeeList[ positionLevel[ applicationPositionIndex + 1 ] ][i].immediateBoss = application.name
    }
  }
  global.employeeList[ application.position ].push( application )
  global.registrationList.splice( tempId, 1 )

  return res.json({ status: 'OK' })
}
const reject = ( index, res )=>{
  global.registrationList.splice( index, 1 )
  return res.json({ status: 'OK'})
}

module.exports = {
  saveRequest: saveRequest,
  getRegistrationList: getRegistrationList,
  approve: approve,
  reject: reject
}