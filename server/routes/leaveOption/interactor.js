const validate = require('jsonschema').validate

const { sendStatusWithMessage } = require('../../utils')
const { id, values } = require('../../constants')
const db = require('../../database')

const createJson = require('./schema/create.json')
const deleteJson = require('./schema/delete.json')


const getLeaveOption = async ( req, res )=>{
  try {
    const leaveOptions = await db.find( `select option_id, name, max, type from leave_options order by name asc;` )
    res.json( leaveOptions )
  }
  catch( err ) {
    console.log( 'leaveOption.getLeaveOption', err )
    return res.sendStatus( 500 )
  }
}

const createLeaveOption = async ( req, res )=>{
  try {
    const data = req.body
    const validation = validate( data, createJson )
    if( validation.valid ) {
      if( values.leaveOption.types.indexOf( data.type ) < 0 ) {
        return sendStatusWithMessage( res, 403, 'Invalid request body.')
      }

      const value = {
        created_by_employee_id: req.user.employeeId,
        ...data
      }
  
      await db.insert( 'leave_options', id.database.keyList.leave_options, [1,2,3,4], [value] )
      
      return res.json({ status: 'ok' })
    }
    else {
      console.log( 'leaveOption.creteLeaveOption', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    if( err.code == 23505 ) {
      return res.status( 403 ).send( 'Duplicate entry.' )
    }

    console.log( 'leaveOption.creteLeaveOption', err )
    return res.sendStatus( 500 )
  }
}

const deleteLeaveOption = async ( req, res )=>{
  try {
    const data = req.body

    const validation = validate( data, deleteJson )
    if( validation.valid ) {
      
      await db.run( `delete from leave_options where option_id=${ data.option_id };` )
      
      return res.json({ status: 'ok' })
    }
    else {
      console.log( 'leaveOption.creteLeaveOption', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'leaveOption.creteLeaveOption', err )
    return res.sendStatus( 500 )
  } 
}



module.exports = {
  createLeaveOption,
  getLeaveOption,
  deleteLeaveOption,
}