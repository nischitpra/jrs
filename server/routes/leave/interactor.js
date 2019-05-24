const validate = require('jsonschema').validate

const { sendStatusWithMessage } = require('../../utils')
const { id, values } = require('../../constants')
const db = require('../../database')

const createLeaveApplicationJSON = require('./schema/createLeaveApplication.json')
const deleteLeaveApplicationJSON = require('./schema/deleteLeaveApplication.json')
const acceptJSON = require('./schema/accept.json')
const rejectJSON = require('./schema/reject.json')

const getMyApplication = async ( req, res )=>{
  try {
    const user = req.user
    const myLeaveList = ( await db.find( `select leave_id, from_date, to_date, reason, type, duration, approval_immediate, approval_senior from leave where employee_id=${ user.employeeId };` ) )
    const myAvailableLeave = await db.find( `select type, accumulated, this_year, used from available_leave where employee_id=${ user.employeeId };` )
   
    const leaveDetails = {
      myLeaveList,
      myAvailableLeave,
    }

    return res.json( leaveDetails )
  }
  catch( err ) {
    console.log( 'leave.getMyLeaveApplication', err )
    return res.sendStatus( 500 )
  }
}

const createApplication = async ( req, res )=>{
  try {
    if( validate( req.body, createLeaveApplicationJSON ) ) {
      const user = req.user
      const data = req.body


      if( data.from_date > data.to_date ) return sendStatusWithMessage( res, 403, 'From date should be less than To date' )

      const availableLeave = ( await db.find( `select * from available_leave where employee_id=${ user.employeeId } and type='${ data.type }';` ) )[0]
      
      if( availableLeave.accumulated + availableLeave.this_year - data.duration <= 0 ) {
        return sendStatusWithMessage( res, 403, 'Insufficient Leaves.' )
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
      data.approval_immediate = 0
      data.approval_senior = 0

      await db.insert( 'leave', id.database.keyList.leave, [1,2,3,4,5,6,7,8,9,10], [data] )
      await db.run( `update available_leave set used=used-${ data.duration } where employee_id=${ user.employeeId } and type='${ data.type }';` )
      
      return res.json({ status: 'ok' })
    }
    else {
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'leave.createLeaveApplication', err )
    return res.sendStatus( 500 )
  }
}

const deleteApplication = async ( req, res )=>{
  try {
    if( validate( deleteLeaveApplicationJSON, req.body ) ) {
      const user = req.user
      const data = req.body

      const application = await db.find( `select * from leave where employee_id=${ user.employeeId } and leave_id=${ data.leave_id };` )[0]

      if( !application ) {
        return sendStatusWithMessage( res, 403, 'Application does not exist.')
      }

      await db.run( `update available_leave set used=used+${ application.duration } where employee_id=${ user.employeeId} and type='${ application.type }';` )
      await db.run( `delete from leave where employee_id=${ user.employeeId } and leave_id=${ data.leave_id };`)
      return res.json({ status: 'ok' })
    }
    else {
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'leave.deleteLeaveApplication', err )
    return res.sendStatus( 500 )
  }
}

const getApplicationForApproval = async ( req, res )=>{
  try {
    const user = req.user
    const leaveListQuery = `select name, department, position, leave_id, from_date, to_date, reason, type, duration, approval_immediate, approval_senior from leave inner join 
      (select * from employee_form_details inner join 
        employee_basic_details on employee_form_details.form_id= employee_basic_details.form_id and employee_basic_details.employee_id=${ user.employeeId })as t on 
        (t.employee_id=leave.immediate_boss_employee_id or t.employee_id=leave.senior_boss_employee_id) and 
        (case when leave.senior_boss_employee_id=t.employee_id then approval_senior=0 else approval_immediate=0 end);`

    const leaveList = await db.find( leaveListQuery )
    
    return res.json( leaveList )
  } 
  catch( err ) {
    console.log( 'leave.getLeaveApplication', err )
    return res.sendStatus( 500 )
  } 
}

const acceptApplicatiion = async ( req, res )=>{
  try {
    if( validate( req.body, acceptJSON ) ) {
      const user = req.user
      const data = req.body

      const { rowCount } = await db.run( `
        update leave set 
        approval_senior=( case when senior_boss_employee_id=${ user.employeeId } then 1 else approval_senior end), 
        approval_immediate=(case when immediate_boss_employee_id=${ user.employeeId } then 1 else approval_immediate end) 
        where (immediate_boss_employee_id=${ user.employeeId } or senior_boss_employee_id=${ user.employeeId }) and leave_id=${ data.leave_id };
      `)

      console.log( rowCount )
      if( rowCount ) {
        return res.json({ status: 'ok' })
      }
      return res.sendStatus( 403 )
    }
    else {
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {

  }
}

const rejectApplication = async ( req, res )=>{
  try {
    if( validate( req.body, rejectJSON ) ) {
      const { rowCount } = await db.run( `
        update leave set 
        approval_senior=( case when senior_boss_employee_id=${ user.employeeId } then -1 else approval_senior end), 
        approval_immediate=(case when immediate_boss_employee_id=${ user.employeeId } then -1 else approval_immediate end) 
        where (immediate_boss_employee_id=${ user.employeeId } or senior_boss_employee_id=${ user.employeeId }) and leave_id=${ data.leave_id };
      `)

      if( rowCount ) {
        return res.json({ status: 'ok' })
      }

      return res.sendStatus( 403 )
    }
    else {
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {

  }
}



module.exports = {
  getMyApplication,
  createApplication,
  deleteApplication,
  getApplicationForApproval,
  acceptApplicatiion,
  rejectApplication,
}