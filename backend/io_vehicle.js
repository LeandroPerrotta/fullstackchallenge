import Io_Pgsql from './io_pgsql.js'

var Io_Vehicle = function Io_Vehicle(){

	this.io = null
	this.raw = []

	this.fieldValidators = {
		plate: async (self, vehicle) => {
			const regexPlaca = /^[a-zA-Z]{3}[0-9]{4}$/;
			const regexPlacaMercosulCarro = /^[a-zA-Z]{3}[0-9]{1}[a-zA-Z]{1}[0-9]{2}$/;	

			let detail

			if(!regexPlaca.test(vehicle.attributes.plate) && !regexPlacaMercosulCarro.test(vehicle.attributes.plate)){
				detail = "Placa em formato inválido."
			}
			else if(await self.io.vehiclePlateExists(vehicle.id, vehicle.attributes.plate)){
				detail = `A placa ${vehicle.attributes.plate} já existe.`
			}

			if(detail == undefined)
				return true	

			return {       
				"detail": detail,
	      		"source": {
		        	"pointer": "vehicle/attributes/plate"
		    	}
	       }
		}
	}	

	if(global.db.m_type == 'pgsql'){
		this.io = new Io_Pgsql()
	}
	else{
		console.log('WARNING :: NO PERSISTENT DATA DEFINED. USING RAW DATA')
		this.raw = new Map()

		this.raw.set(2, {plate: '555555', brand: 'Chevrolet', type: 'Classico', version: 'Qualquer', year: 1970, color: 'Preto' })
		this.raw.set(1, {plate: '666666', brand: 'Volkswagen', type: 'Classico', version: 'Qualquer', year: 1965, color: 'Amarelo' })		
	}
}

Io_Vehicle.prototype.doValidation = async function(vehicle){

	for(let field in vehicle.attributes){
		if(this.fieldValidators[field] != undefined){
			let ret = await this.fieldValidators[field](this, vehicle)

			if(typeof ret == 'object'){
				return ret
			}
		}
	}

	return true
}

Io_Vehicle.prototype.getNewIndex = function(){
  let newIndex = 0

  for(let[key, value] of this.raw){
    newIndex = Math.max(key + 1, newIndex)
  }

  return newIndex
}

Io_Vehicle.prototype.listAll = async function(){

	let out = {
		data: []
	}

	if(this.io){
		let rows = await this.io.vehicleListAll()

		if(rows.length > 0){
			for(let x in rows){
				let row = rows[x]
				out.data.push(global.rawItemToJSONAPI(row.id, row, 'Vehicle'))
			}
		}
	}
	else{
	  for(let [id, data] of this.raw){
	    out.data.push(global.rawItemToJSONAPI(id, data, 'Vehicle'))
	  }  
	}

	return out
}

Io_Vehicle.prototype.create = async function(vehicle){

	let out = {
		data: []
	}

	let ret = await this.doValidation(vehicle)
	if(typeof ret === 'object'){
		return ret
	}	

	if(this.io){
		let row = await this.io.vehicleCreate(vehicle)

		if(row)
			out.data.push(global.rawItemToJSONAPI(row.id, row, 'Vehicle'))
		else
			return false
	}
	else{
		let new_id = getNewIndex()

		if(!this.raw.set(new_id, vehicle.attributes))
			return false
	}

	return out
}

Io_Vehicle.prototype.delete = async function(id){

	if(this.io){
		return await this.io.vehicleDelete(id)
	}
	else{
		if(this.raw.delete(id)){
			return true
		}
		else
			return false
	}		
}

Io_Vehicle.prototype.update = async function(id, vehicle){

	let ret = await this.doValidation(vehicle)

	if(typeof ret == 'object'){
		return ret
	}

	if(this.io){
		return await this.io.vehicleUpdate(id, vehicle)
	}
	else{
		if(this.raw.set(id, vehicle.attributes)){
			return true
		}
		else
			return false
	}	
}

export default Io_Vehicle;