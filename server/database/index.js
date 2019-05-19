const {id, values, database } = require('../constants')
const pg = require('pg')
const pool = new pg.Pool(database.credentials)



module.exports = {
  
  async insert( tableName, keys, usedColumns, _values ) {
    let columnName=[]
    for( var i in usedColumns ) {
        columnName.push( keys[usedColumns[i]].columnName )
    }
    columnName.push( 'timestamp' ) // timestamp
    columnName = `( ${ columnName.join(',')} )`

    let valueString=[]
    for( let j in _values ) {
        let insertString=[]
        for( var i in usedColumns ) {
            insertString.push( `'${_values[j][keys[usedColumns[i]].columnName]}'` )
        }
        insertString.push( `'${new Date().getTime()}'` ) //timestamp
        insertString=`( ${ insertString.join(',') } )`
        valueString.push( insertString )
    }
    valueString=valueString.join( ',' )

    const _query =`insert into ${tableName} ${columnName} values ${valueString};`
    // console.log( 'insert', _query )
    const result = await pool.query( _query )
    return result
  },
  
  async find( _query ) {
    // console.log( 'find',_query )
    const { rows } = await pool.query( _query )
    return rows
  },

  async run( _query ) {
    // console.log( 'run', _query )
    const result = await pool.query( _query )
    return result
  },

  createTable(tableName, callback){
    pool.connect((err, client, done)=>{
      if(err){
         done()
         return callback(values.status.error, `${tableName} => ${err}`)
      }
      const formStructure = id.database.keyList[tableName]
      let _query=""
      for(let i in formStructure){
        _query += formStructure[i].columnName + " " + formStructure[i].type + ", "
      }
      _query = _query.slice(0,-2)
      const fq= `create table if not exists ${tableName} (${_query});`
      const query = client.query(fq,(err, res) => {
             done()
             if(err){
                  console.log(fq)
                  return callback(values.status.error,`${tableName} => ${err}`)
              }
             return callback(values.status.ok, `${tableName} => ok `)
          })
    })
    
  },
}
