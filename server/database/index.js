const {id, values, database } = require('../constants')
const pg = require('pg')
const pool = new pg.Pool(database.credentials)



module.exports = {

  async insert( tableName, keyList, includeKeys, _values ) {
    var idx=1;
    var params=[];
    var values=[];

    const keys = includeKeys.map( keyIdx=>keyList[ keyIdx ].columnName )
    keys.push( 'timestamp' ) // timestamp

    for( var i in _values ) {
      var row=[];
      for( var j in keys ) {
        if( keys[j]=='timestamp') { values.push( new Date().getTime() ) }
        else { values.push( _values[i][keys[j]] ) }
        row.push( '$' + idx++ );
      }
      params.push( '(' + row.join( ',' ) + ')' )
    }
    params=params.join( ',' );

    const query = `insert into ${ tableName } (${ keys.join( ',' ) }) values ${params};`
    console.log( 'insert', query, values )
    const result = await pool.query( query, values )
    return result
  },
  
  async find( _query, values ) {
    console.log( 'find',_query, values )
    const { rows } = await pool.query( _query, values )
    return rows
  },

  async run( _query, values ) {
    console.log( 'run', _query, values )
    const result = await pool.query( _query, values )
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
