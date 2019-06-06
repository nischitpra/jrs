const validate = require('jsonschema').validate

const { sendStatusWithMessage } = require('../../utils')
const { id, values } = require('../../constants')
const db = require('../../database')

const createJson = require('./schema/create.json')
const deleteJson = require('./schema/delete.json')


const getLeaveOption = async ( req, res )=>{
  try {
    const leaveOptions = await db.find( `
      select option_id, name, max, type, created_by_employee_name from leave_options as c inner join 
        ( select employee_id, name as created_by_employee_name from employee_id_realtions as a inner join 
          ( select form_id, name from employee_basic_form_details ) as b on a.form_id=b.form_id ) 
        as d on c.created_by_employee_id=d.employee_id order by c.name asc;`, [] )
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

      const employeeIdList = await db.find( `select employee_id from employee_id_realtions;` )

      const dataList = []
      for( var i in employeeIdList ) {
        dataList.push({
          employee_id: employeeIdList[i].employee_id,
          type: data.name,
          accumulated: 0,
          this_year: data.max,
          used: 0,
        })
      }

      console.log( dataList )

      await db.insert( 'available_leave', id.database.keyList.available_leave, [1,2,3,4,5], dataList )

      return res.json({ status: 'ok' })
    }
    else {
      console.log( 'leaveOption.creteLeaveOption', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    if( err.code == 23505 ) {
      console.log( 'leaveOption.creteLeaveOption', 'Duplicate entry.' )
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
      const optionDetail = ( await db.find( `select * from leave_options where option_id=$1;`, [data.option_id] ) )[0]
      await db.run( `delete from leave_options where option_id=$1;`, [data.option_id] )
      await db.run( `delete from available_leave where type=$1`, [optionDetail.name] )
      
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