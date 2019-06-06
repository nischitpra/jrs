const validate = require('jsonschema').validate

const { sendStatusWithMessage } = require('../../utils')
const { id, values } = require('../../constants')
const db = require('../../database')

const createJson = require('./schema/create.json')
const editJson = require('./schema/edit.json')


const getOption = async ( req, res )=>{
  try {
    const data = await db.find( `select department_id, name, created_by_employee_name from department_options as c inner join 
    ( select employee_id, name as created_by_employee_name from employee_id_realtions as a inner join 
      ( select form_id, name from employee_basic_form_details ) as b on a.form_id=b.form_id ) 
    as d on c.created_by_employee_id=d.employee_id order by c.name asc;`, [] )

    return res.json( data )
  }
  catch( err ) {
    console.log( 'departmentOption.getOption', err )
    return res.sendStatus( 500 )
  }
}

const createOption = async ( req, res )=>{
  try {
    const validation = validate( req.body, createJson )
    if( validation.valid ) {
      const user = req.user
      const data = {
        created_by_employee_id: user.employeeId,
        ...req.body
      }

      await db.insert( 'department_options', id.database.keyList.department_options, [1,2], [data] )

      return res.json({ status: 'ok' })
    }
    else {
      console.log( 'departmentOption.createOption', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    if( err.code == 23505 ) {
      console.log( 'leaveOption.creteLeaveOption', 'Duplicate entry.' )
      return res.status( 403 ).send( 'Duplicate entry.' )
    }
    console.log( 'departmentOption.createOption', err )
    return res.sendStatus( 500 )
  }
}

const editOption = async ( req, res )=>{
  try {
    const validation = validate( req.body, editJson )
    if( validation.valid ) {
      const user = req.user
      const data = req.body
      data.created_by_employee_id = user.employeeId

      const previous = ( await db.find( `select * from department_options where department_id=$1;`, [data. department_id] ) )[0]
      if( !previous ) {
        return sendStatusWithMessage( res, 403, 'Department option not found.')
      }

      await db.run( `update employee_basic_form_details set department=$1 where department=$2;`, [data.name, previous.department] )

      const { rowCount} = await db.run( `update department_options set name=$1, created_by_employee_id=$2 where department_id=$3;`,
        [data.name, user.employeeId, data.department_id] )
      
      if( rowCount > 0 ) {
        return res.json({ status: 'ok' })
      }
      else {
        return res.status( 403 ).send( 'Could not edit option.' )
      }
    }
    else {
      console.log( 'departmentOption.editOption', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'departmentOption.editOption', err )
    return res.sendStatus( 500 )
  }
}



module.exports = {
  createOption,
  getOption,
  editOption,
}