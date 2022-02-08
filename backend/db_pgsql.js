import pg from 'pg'

const SCHEMA = 'backend_db'
const TABLE = 'vehicles'

var DbPgqlDriver = function DbPgqlDriver(){

  this.conn = new pg.Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: '###',
    port: 5432,
  })

  this.conn.connect()
  this.checkDatabase()

  /* still need understand why in pgsql schema and database need to be different stuffs */ 
  this.conn.query(`SET search_path TO ${SCHEMA};`)
}

DbPgqlDriver.prototype.getConnection = function(){
  return this.conn
}

DbPgqlDriver.prototype.checkDatabase = async function(){

  const query = `
  SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE  table_schema = $1
   AND    table_name   = $2
   )
  `
  const values = [ SCHEMA, TABLE ]

  try {
    const res = await this.conn.query(query, values)
    let hasTable = res.rows[0].exists

    if(!hasTable){

      console.log('PgSQL database structore not found. Creating...')

      try{
        await this.conn.query(`CREATE SCHEMA ${SCHEMA}`)
      }
      catch(e){
        console.log(e.stack)
        return false
      }

      try{
        await this.conn.query(`
          CREATE TABLE IF NOT EXISTS ${SCHEMA}.${TABLE}
          (
            id SERIAL NOT NULL,
            plate VARCHAR(255),
            brand VARCHAR(255),
            model VARCHAR(255),
            version VARCHAR(255),
            color VARCHAR(255),
            year VARCHAR(255),
            CONSTRAINT vehicles_pkey PRIMARY KEY (id)
          )`)
      }
      catch(e){
        console.log(e.stack)
        return false
      }

      console.log('Created...')
    }
  } catch (err) {
    console.log(err.stack)
  }   

  return true  
}

export default DbPgqlDriver;