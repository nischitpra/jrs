const db = require('../../database')
const { values, id } = require('../../constants')
const { sendStatusWithMessage } = require( '../../utils' )

const getBasicDetails = async ( user, res )=>{
  try {
    const details = ( await db.find( `select name, email, sex, department, position, position_level from employee_basic_details, employee_form_details 
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

const calculateMaxLeaveLimit = ( leaveList )=>{
  const sum = {}

  for( let i in leaveList ) {
    if( !sum[ leaveList[i].leave_type ] ) sum[ leaveList[i].leave_type] = 0

    switch( leaveList[i].leave_type ) {
      // can accumulate
      case 'personal':
      case 'sick':
        sum[ leaveList[i].leave_type ] += leaveList[i].duration 
        break
      // cannot accumulate
      case 'casual':
        if( new Datea( leaveList[i].from_date ).getFullYear() == new Date().getFullYear() ) sum[ leaveList[i].leave_type ] += leaveList[i].duration 
        break
      // max 2 times throughout job cycle
      case 'maternity':
        sum[ leaveList[i].leave_type ] += leaveList[i].duration 
        break
      // no limit
      case 'mourning':
        break
    } 
  }

  const maxPersonalLeavePossibleTillNow = ( new Date().getFullYear() - 2019 ) * 6 + 6
  sum.personal = maxPersonalLeavePossibleTillNow - ( sum.personal || 0 )
  const masSickLeavePossibleTillNow = ( new Date().getFullYear() - 2019 ) * 6 + 6
  sum.sick = masSickLeavePossibleTillNow - ( sum.sick || 0 )
  sum.casual = values.applyForLeave.maxLeaveLimit.casual - ( sum.casual || 0 )
  sum.maternity = values.applyForLeave.maxLeaveLimit.maternity * 2 - ( sum.maternity || 0 )
  sum.mourning = values.applyForLeave.maxLeaveLimit.mourning

  return sum
}

const getMyLeaveApplication = async ( user, res )=>{
  try {
    const leaveList = ( await db.find( `select leave_id, from_date, to_date, reason, leave_type, duration, approval_count from leave where employee_id=${ user.employeeId };` ) )
    
    const maxLeaveLimit = calculateMaxLeaveLimit( leaveList )

    // calculate max leave limit
    const leaveDetails = {
      myLeaveList: leaveList,
      maxLeaveLimit,
    }

    return res.json( leaveDetails )
  }
  catch( err ) {
    console.log( 'employeeDetails.getApplicationForLeave', err )
    return res.sendStatus( 500 )
  }
}

const getApplicationForLeave = async ( user, res )=>{
  try {
    const leaveList = ( await db.find( `select name, department, position, leave_id, from_date, to_date, reason, leave_type, duration, approval_count from leave 
      inner join (select employee_id, name, department, position from employee_form_details 
        inner join employee_basic_details on employee_form_details.form_id=employee_basic_details.form_id) as t 
          on leave.employee_id=t.employee_id where approval_count < 2 and approval_count >= 0
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
    if( !data.from_date ) return sendStatusWithMessage( res, 403, 'Invalid from date' )
    if( !data.to_date ) return sendStatusWithMessage( res,  403,'Invalid to date' )
    if( data.from_date > data.to_date ) return sendStatusWithMessage( res, 403, 'From date should be less than To date' )
    if( !data.reason ) return sendStatusWithMessage( res, 403, 'Enter reason' )
    if( !data.leave_type ) return sendStatusWithMessage( res, 403, 'Select a Leave type' )

    const leaveList = ( await db.find( `select leave_id, from_date, to_date, reason, leave_type, duration, approval_count from leave where employee_id=${ user.employeeId };` ) )
    const maxLeaveLimit = calculateMaxLeaveLimit( leaveList )

    const remainingLeaves = data.leave_type == 'without_pay'? 1 : maxLeaveLimit[ data.leave_type ] - data.duration

    if( remainingLeaves < 0 ) {
      return sendStatusWithMessage( res, 403, 'Insufficient Leave.' )
    }

    const pendingCount = ( await db.find( `select * from leave where approval_count > 0 and approval_count < 2 and employee_id=${ user.employeeId };` ) ).length
    
    if( pendingCount > 0 ) {
      return sendStatusWithMessage( res, 403, 'You already have a pending leave request.' )
    }

    let immediateBossEmployeeId = ( 
      await db.find( `select immediate_boss_employee_id from employee_basic_details where employee_id=${ user.employeeId };` ) )[0]
    immediateBossEmployeeId = immediateBossEmployeeId > 0 ? immediateBossEmployeeId.immediate_boss_employee_id : user.employeeId // or case for ceo
    console.log( 'immediateBossEmployeeId', immediateBossEmployeeId )

    let seniorBossEmployeeId = ( 
      await db.find( `select immediate_boss_employee_id from employee_basic_details where employee_id=${ immediateBossEmployeeId };` ) )[0] 
    seniorBossEmployeeId = seniorBossEmployeeId > 0 ? seniorBossEmployeeId.immediate_boss_employee_id : immediateBossEmployeeId // or case for ceo
    console.log( 'seniorBossEmployeeId', seniorBossEmployeeId )


    data.employee_id = user.employeeId
    data.immediate_boss_employee_id = immediateBossEmployeeId
    data.senior_boss_employee_id = seniorBossEmployeeId
    data.approval_count = 0

    await db.insert( 'leave', id.database.keyList.leave, [1,2,3,4,5,6,7,8,9], [data] )
    
    return res.json({ status: 'ok' })
  }
  catch( err ) {
    console.log( 'employeeDetails.applyForLeave', err )
    return res.sendStatus( 500 )
  }
}

const acceptLeave = async ( user, data, res )=>{
  try {
    const { rowCount } = await db.run( `update leave set approval_count= ( case when senior_boss_employee_id=-1 then approval_count + 2 else approval_count+1 end) where leave_id=${ data.leaveId } 
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
    const { rowCount } = await db.run( `update leave set approval_count=approval_count - 10 where leave_id=${ data.leaveId }
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