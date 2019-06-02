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
    const validation = validate( req.body, createLeaveApplicationJSON )
    if( validation.valid ) {
      const user = req.user
      const data = req.body


      if( data.from_date > data.to_date ) return sendStatusWithMessage( res, 403, 'From date should be less than To date' )

      const availableLeave = ( await db.find( `select * from available_leave where employee_id=${ user.employeeId } and type='${ data.type }';` ) )[0]
      
      if( availableLeave.accumulated + availableLeave.this_year - availableLeave.used - data.duration < 0 ) {
        return sendStatusWithMessage( res, 403, 'Insufficient Leaves.' )
      }
      
      const userData = ( await db.find( `select * from employee_form_details inner join employee_basic_details on employee_form_details.form_id=employee_basic_details.form_id where employee_id=${ user.employeeId };` ) )[0]

      console.log( user, data )

      if( userData.sex.toLowerCase() != 'f' && data.type.toLowerCase()=='maternity' ) {
        return sendStatusWithMessage( res, 403, 'Invalid request body.' )
      }

      const immediateBossEmployeeId = ( 
        await db.find( `select immediate_boss_employee_id from employee_basic_details where employee_id=${ user.employeeId };` ) )[0].immediate_boss_employee_id
      console.log( 'immediateBossEmployeeId', immediateBossEmployeeId )

      const seniorBossEmployeeId = ( 
        await db.find( `select immediate_boss_employee_id from employee_basic_details where employee_id=${ immediateBossEmployeeId };` ) )[0].immediate_boss_employee_id
      console.log( 'seniorBossEmployeeId', seniorBossEmployeeId )

      
      data.employee_id = user.employeeId
      data.immediate_boss_employee_id = immediateBossEmployeeId
      data.senior_boss_employee_id = seniorBossEmployeeId
      data.approval_immediate = 0
      data.approval_senior = 0

      await db.insert( 'leave', id.database.keyList.leave, [1,2,3,4,5,6,7,8,9,10], [data] )
      
      return res.json({ status: 'ok' })
    }
    else {
      console.log( 'leave.createLeaveApplication', validation.errors )
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
    const validation = validate( req.body, deleteLeaveApplicationJSON )
    if( validation.valid ) {
      const user = req.user
      const data = req.body

      const application = ( await db.find( `select * from leave where employee_id=${ user.employeeId } and leave_id=${ data.leave_id };` ) )[0]

      if( !application ) {
        return sendStatusWithMessage( res, 403, 'Application does not exist.')
      }

      const { rowCount } = await db.run( `delete from leave where employee_id=${ user.employeeId } and leave_id=${ data.leave_id } and approval_immediate=0 and approval_senior=0;`)
      
      if( rowCount > 0 ) {
        return res.json({ status: 'ok' })
      }
      else {
        return res.status( 403 ).send( 'Could not delete application.' )
      }
    }
    else {
      console.log( 'leave.deleteLeaveApplication', validation.errors )
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
    
    const leaveListQuery = `select * from employee_form_details as c inner join (select * from employee_basic_details as a inner join ( select * from leave where ( case when immediate_boss_employee_id=${ user.employeeId } then approval_immediate=0 when senior_boss_employee_id=${ user.employeeId } then approval_senior=0 end) ) as b on a.employee_id=b.employee_id ) as d on c.form_id=d.form_id;`

    const leaveList = await db.find( leaveListQuery )
    
    return res.json( leaveList )
  } 
  catch( err ) {
    console.log( 'leave.getLeaveApplication', err )
    return res.sendStatus( 500 )
  } 
}

const acceptApplication = async ( req, res )=>{
  try {
    const validation = validate( req.body, acceptJSON )
    if( validation.valid ) {
      const user = req.user
      const data = req.body
      
      const application = ( await db.find( `select * from leave inner join available_leave on leave.employee_id=available_leave.employee_id and available_leave.type=leave.type where leave.leave_id=${ data.leave_id };` ) )[0]
      if( !application ) {
        return sendStatusWithMessage( res, 403, 'Application does not exist.')
      }
      
      if( ( application.accumulated + application.this_year - application.used - application.duration ) < 0 ) {
        return sendStatusWithMessage( res, 403, 'Insufficient leaves.')
      } 
      
      const { rowCount } = await db.run( `
        update leave set 
        approval_senior=( case when senior_boss_employee_id=${ user.employeeId } then 1 else approval_senior end), 
        approval_immediate=(case when immediate_boss_employee_id=${ user.employeeId } then 1 else approval_immediate end) 
        where (immediate_boss_employee_id=${ user.employeeId } or senior_boss_employee_id=${ user.employeeId }) and leave_id=${ data.leave_id };
      `)
      if( application.immediate_boss_employee_id == user.employeeId ) {
        application.approval_immediate++
      }
      else if( application.senior_boss_employee_id == user.employeeId ) {
        application.approval_senior++
      }
      if( application.approval_immediate + application.approval_senior >= 2 ) {
        await db.run( `update available_leave set used=used+${ application.duration } where employee_id=${ application.employee_id} and type='${ application.type }';` )
      }

      if( rowCount ) {
        return res.json({ status: 'ok' })
      }
      return res.sendStatus( 403 )
    }
    else {
      console.log( 'leave.acceptApplication', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'leave.acceptApplication', err )
    return res.sendStatus( 500 )
  }
}

const rejectApplication = async ( req, res )=>{
  try {
    const user = req.user
    const data = req.body

    const validation = validate( req.body, rejectJSON )
    if( validation.valid ) {

      const application = ( await db.find( `select * from leave where leave_id=${ data.leave_id };` ) )[0]

      if( !application ) {
        return sendStatusWithMessage( res, 403, 'Application does not exist.')
      }
      
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
      console.log( 'leave.rejectApplication', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'leave.rejectApplication', err )
    return res.sendStatus( 500 )
  }
}



module.exports = {
  getMyApplication,
  createApplication,
  deleteApplication,
  getApplicationForApproval,
  acceptApplication,
  rejectApplication,
}