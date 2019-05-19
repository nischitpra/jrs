const db = require('../../database')
const { id } = require('../../constants')

const getBasicDetails = async ( user, res )=>{
  try {
    const details = ( await db.find( `select name, email, department, position, position_level from employee_basic_details, employee_form_details 
      where employee_basic_details.form_id=employee_form_details.form_id and employee_id=${ user.employeeId };` ) )[0]
  
    return res.json( details )
  }
  catch( err ) {
    console.log( 'employeeDetails.getBasicDetails', err )
    return res.sendStatus( 500 )
  }
}

const getProfileDetails = async ( user, res )=>{
  try {
    const personalDetails = ( await db.find( 
      `select * from employee_form_details where form_id in ( select form_id from employee_basic_details where employee_id=${ user.employeeId });` ) )[0]
    delete personalDetails.form_id
    delete personalDetails.timestamp
    delete personalDetails.status

    const immediateBossDetails = ( await db.find( 
      `select name, email, department, position, position_level from employee_form_details where form_id = 
        ( select form_id from employee_basic_details where employee_id in 
          ( select immediate_boss_employee_id from employee_basic_details where employee_id = ${ user.employeeId } ) );` ) )[0]
    
    return res.json({ personalDetails, immediateBossDetails })
  }
  catch( err ) {
    console.log( 'employeeDetails.getProfileDetails', err )
    return res.sendStatus( 500 )
  }
}

const changePassword = async ( user, data, res )=>{
  try {
    const values = await db.find( `select * from login where employee_id=${ user.employeeId } and password='${ data.oldPassword }';` )
    if( values.length ) {
      await db.run( `update login set password='${ data.newPassword }' where employee_id=${ user.employeeId };` )
      
      return res.json({ status: 'ok' })
    }

    return res.sendStatus( 403 )
  }
  catch( err ) {
    console.log( 'employeeDetails.changePassword', err )
    return res.sendStatus( 500 )
  }
}

const getMyLeaveApplication = async ( user, res )=>{
  try {
    const leaveList = ( await db.find( `select leave_id, from_date, to_date, reason, approval_count from leave where approval_count < 2 
      and employee_id=${ user.employeeId };` ) )
    
    return res.json( leaveList )
  }
  catch( err ) {
    console.log( 'employeeDetails.getApplicationForLeave', err )
    return res.sendStatus( 500 )
  }
}

const getApplicationForLeave = async ( user, res )=>{
  try {
    const leaveList = ( await db.find( `select leave_id, from_date, to_date, reason, approval_count from leave where approval_count < 2 and approval_count >= 0
      and ( immediate_boss_employee_id=${ user.employeeId } or senior_boss_employee_id=${ user.employeeId } );` ) )
    
    return res.json( leaveList )
  }
  catch( err ) {
    console.log( 'employeeDetails.getApplicationForLeave', err )
    return res.sendStatus( 500 )
  }
}

const applyForLeave = async ( user, data, res )=>{
  try {
    const immediateBossEmployeeId = ( 
      await db.find( `select immediate_boss_employee_id from employee_basic_details where employee_id=${ user.employeeId };` ) )[0].immediate_boss_employee_id || user.employeeId // or case for ceo
    const seniorBossEmployeeId = ( 
      await db.find( `select immediate_boss_employee_id from employee_basic_details where employee_id=${ immediateBossEmployeeId };` ) )[0].immediate_boss_employee_id || immediateBossEmployeeId // or case for ceo

    data.employee_id = user.employeeId
    data.immediate_boss_employee_id = immediateBossEmployeeId
    data.senior_boss_employee_id = seniorBossEmployeeId
    data.approval_count = 0

    await db.insert( 'leave', id.database.keyList.leave, [1,2,3,4,5,6,7], [data] )
    
    return res.json({ status: 'ok' })
  }
  catch( err ) {
    console.log( 'employeeDetails.applyForLeave', err )
    return res.sendStatus( 500 )
  }
}

const acceptLeave = async ( user, data, res )=>{
  try {
    const { rowCount } = await db.run( `update leave set approval_count=approval_count + 1 where leave_id=${ data.leaveId } 
      and ( immediate_boss_employee_id=${ user.employeeId } or senior_boss_employee_id=${ user.employeeId } );` )
    
    if( rowCount ) {
      return res.json({ status: 'ok' })
    }

    return res.sendStatus( 403 )
  }
  catch( err ) {
    console.log( 'employeeDetails.acceptLeave', err )
    return res.sendStatus( 500 )
  }
}

const rejectLeave = async ( user, data, res )=>{
  try {
    const { rowCount } = await db.run( `update leave set approval_count=approval_count - 1 where leave_id=${ data.leaveId }
      and ( immediate_boss_employee_id=${ user.employeeId } or senior_boss_employee_id=${ user.employeeId } );` )

    if( rowCount ) {
      return res.json({ status: 'ok' })
    }

    return res.sendStatus( 403 )
  }
  catch( err ) {
    console.log( 'employeeDetails.rejectLeave', err )
    return res.sendStatus( 500 )
  }
}

module.exports = {
  getBasicDetails,
  getProfileDetails,
  changePassword,
  getMyLeaveApplication,
  getApplicationForLeave,
  applyForLeave,
  acceptLeave,
  rejectLeave,
}