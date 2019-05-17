const db = require('../database')
module.exports = async ( req, res, next )=>{
  const token = req.get('token')
  
  if( !token ) return res.sendStatus( 403 )
  
  const rows = await db.find(`select employee_id from login_session where token=${token};`)
  
  if( !rows || !rows[0] ) return res.sendStatus( 403 )
  
  req.user = {
    employeeId: rows[0]
  }
  next()
}