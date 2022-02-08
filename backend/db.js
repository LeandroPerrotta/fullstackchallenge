import DbPgqlDriver from './db_pgsql.js'

class DbConnector{

	m_driver = null;
	m_type = 'pgsql';

	constructor(type){
		this.m_driver = new DbPgqlDriver()
	}

	getDriver(){
		return this.m_driver
	}
}

export default DbConnector;