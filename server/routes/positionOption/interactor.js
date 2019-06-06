const validate = require('jsonschema').validate

const { sendStatusWithMessage } = require('../../utils')
const { id, values } = require('../../constants')
const db = require('../../database')

const createJson = require('./schema/create.json')
const editJson = require('./schema/edit.json')


const getPositionOption = async ( req, res )=>{
  try {
    const data = await db.find( `select position_id, name, position_level, department, created_by_employee_name from position_options as c inner join 
    ( select employee_id, name as created_by_employee_name from employee_id_realtions as a inner join 
      ( select form_id, name from employee_basic_form_details ) as b on a.form_id=b.form_id ) 
    as d on c.created_by_employee_id=d.employee_id order by c.name asc;`, [] )

    return res.json( data )
  }
  catch( err ) {
    console.log( 'positionOption.getPositionOption', err )
    return res.sendStatus( 500 )
  }
}

const createPositionOption = async ( req, res )=>{
  try {
    const validation = validate( req.body, createJson )
    if( validation.valid ) {
      const user = req.user
      const data = {
        created_by_employee_id: user.employeeId,
        ...req.body
      }

      const departmentList = await db.find( `select * from department_options where name=$1;`, [data.department])
      if( departmentList.length == 0 ) {
        return sendStatusWithMessage( res, 403, 'Invalid department not found.')
      }

      await db.insert( 'position_options', id.database.keyList.position_options, [1,2,3,4], [data] )

      return res.json({ status: 'ok' })
    }
    else {
      console.log( 'positionOption.createPositionOption', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    if( err.code == 23505 ) {
      console.log( 'leaveOption.creteLeaveOption', 'Duplicate entry.' )
      return res.status( 403 ).send( 'Duplicate entry.' )
    }
    console.log( 'positionOption.createPositionOption', err )
    return res.sendStatus( 500 )
  }
}

const editPositionOption = async ( req, res )=>{
  try {
    const validation = validate( req.body, editJson )
    if( validation.valid ) {
      const user = req.user
      const data = req.body
      data.created_by_employee_id = user.employeeId

      const previous = ( await db.find( `select * from position_options where position_id=$1;`, [data.position_id] ) )[0]
      if( !previous ) {
        return sendStatusWithMessage( res, 403, 'Position option not found.')
      }

      await db.run( `update employee_basic_form_details set position=$1 where position=$2 and department=$3;`, 
        [data.name, previous.position, previous.department] )

      const { rowCount} = await db.run( `update position_options set name=$1, position_level=$2, department=$3, created_by_employee_id=$4 where position_id=$5;`, 
        [data.name, data.position_level, data.department, user.employeeId, data.position_id] )
      
      if( rowCount > 0 ) {
        return res.json({ status: 'ok' })
      }
      else {
        return res.status( 403 ).send( 'Could not edit option.' )
      }
    }
    else {
      console.log( 'positionOption.createPositionOption', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'positionOption.editPositionOption', err )
    return res.sendStatus( 500 )
  }
}



module.exports = {
  createPositionOption,
  getPositionOption,
  editPositionOption,
}