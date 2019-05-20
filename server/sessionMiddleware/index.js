const db = require('../database')
module.exports = async ( req, res, next )=>{
  try {
    const token = req.get('token')
  
    if( !token ) return res.sendStatus( 401 )
    
    const rows = await db.find(`select employee_id from login_session where token='${token}';`)
    
    if( !rows || !rows[0] ) return res.sendStatus( 401 )

    req.user = {
      employeeId: rows[0].employee_id
    }
    next()
  }
  catch( err ) {
    console.log( 'sessionMiddleware', err )
    return res.sendStatus( 500 )
  }
  
}