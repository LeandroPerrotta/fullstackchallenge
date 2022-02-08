
var Io_Pgsql = function Io_Pgsql(){
	this.conn = global.db.getDriver().getConnection()
}

Io_Pgsql.prototype.vehicleCreate = async function(vehicle, callback){

	vehicle = vehicle.attributes //just because what we want is not in the root node

	const query = "INSERT INTO vehicles(plate, brand, model, version, year, color) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
	const values = [ vehicle.plate, vehicle.brand, vehicle.model, vehicle.version, vehicle.year, vehicle.color ]

	try {
		const res = await this.conn.query(query, values)
		return res.rows[0]

	} catch (err) {
	  console.log(err.stack)
	}	

	return false
}

Io_Pgsql.prototype.vehiclePlateExists = async function(id, plate){

	const query = 'SELECT id FROM vehicles WHERE id != $1 AND plate = $2 LIMIT 1'
	const values = [ id || 0, plate ]

	try {
		const res = await this.conn.query(query, values)
		return res.rowCount > 0
	} catch (err) {
	  console.log(err.stack)
	}		

	return true
}

Io_Pgsql.prototype.vehicleListAll = async function(vehicle){

	const query = 'SELECT id, plate, brand, model, version, year, color FROM vehicles'

	try {
		const res = await this.conn.query(query)
		return res.rows
	} catch (err) {
	  console.log(err.stack)
	}		

	return false
}

Io_Pgsql.prototype.vehicleDelete = async function(id){

	const query = 'DELETE FROM vehicles WHERE id = $1'
	const values = [ id ]

	try {
		const res = await this.conn.query(query, values)
		return true

	} catch (err) {
	  console.log(err.stack)
	}	

	return false
}

Io_Pgsql.prototype.vehicleUpdate = async function(id, vehicle){

	let fieldList = ''
	let values = []

	let n = 1
	for(let field in vehicle.attributes){
		let value = vehicle.attributes[field]
		fieldList = fieldList + `${field} = $${n}, `
		values.push(value)
		n++
	}

	fieldList = fieldList.slice(0, fieldList.length - 1);
	fieldList = fieldList.slice(0, fieldList.length - 1);	

	values.push(id)

	const query = `UPDATE vehicles SET ${fieldList} WHERE id = $${n}`

	try {
		const res = await this.conn.query(query, values)
		return true

	} catch (err) {
	  console.log(err.stack)
	}	

	return false
}

export default Io_Pgsql;