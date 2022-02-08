import fetch from 'node-fetch';

//can change to CACHE if want use cached data. but it takes long time to sync all data
const MODE = 'API' 

//updates cached data every 12h. only works when MODE = CACHE
const UPDATE_INTERVAL = 1000 * 60 * 60 * 12

function ParserVehicleOptions(){
	console.log('Parsing vehicles options...')

	//brands, models, years 			= raw data
	//brandsOut, modelsOut, yearsOut 	= cached JSON:API format for fast deliver
	this.brands = new Map()
	this.brandsOut = { }

	this.models = new Map()
	this.modelsOut = new Map()

	this.years = new Map()
	this.yearsOut = new Map()

	this.updateEvent = null

	if(MODE == 'CACHE'){
		this.fetchBrands()
	}
}

ParserVehicleOptions.prototype.fetchBrands = async function(){

	const url = 'https://parallelum.com.br/fipe/api/v1/carros/marcas'
	this.brandsOut.data = []
	this.modelsOut = new Map()
	this.yearsOut = new Map()

	try{
		let response = await fetch(url)
		const data = await response.json()

		let total_brands = data.length 

		const BRANDS_MAX = 5 //can be total_brands for a full sync

		for(let x in data){
			let brand = data[x]

			let brand_id = parseInt(brand.codigo)

			this.brands.set(brand_id, brand.nome)
			this.brandsOut.data.push(global.rawItemToJSONAPI(brand_id, { brand: brand.nome }, 'Brand'))

			if(MODE == 'CACHE'){
				await this.fetchModel(brand_id)
			}

			if(MODE == 'CACHE' && x == BRANDS_MAX){
				//it would take more than a hour to do a full sync, so, as it just for testing
				//I will grab only the first 5 brands and all its related data

				//OBS: It maybe would be easier/better just do a direct call to their API, request the data
				//and serialize it in JSON:API format to feed Ember. But I wanted parse the full data
				//to create a complete caching system (later it could be keep at MongoDB for fast access)
				//the cached system offer best perfomance and also no dependency on 3rd party APIs on core functionality
				//the only downback is the long time to do an first sync
				break;
			}

			if(MODE == 'CACHE'){
			    process.stdout.clearLine();
			    process.stdout.cursorTo(0);
			    process.stdout.write(parseInt(x / BRANDS_MAX * 100) + '%');		
		    }		
		}
	}
	catch(e){
		console.log(e)
	}

	if(MODE == 'CACHE')
		this.updateEvent = setTimeout(this.fetchBrands.bind(this), UPDATE_INTERVAL)
}

ParserVehicleOptions.prototype.fetchModel = async function(brand_id){

	const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand_id}/modelos`

	let response

	try{
		response = await fetch(url)
		const data = await response.json()

		for(let x in data.modelos){
			let model = data.modelos[x]

			let id = parseInt(model.codigo)

			if(this.models.has(id)){
				console.log(model)
			}

			this.models.set(id, { model: model.nome, 'brand-id': brand_id} )

			if(!this.modelsOut.has(brand_id)){
				this.modelsOut.set(brand_id, { data: [] })
			}

			this.modelsOut.get(brand_id).data.push(global.rawItemToJSONAPI(id, { model: model.nome, 'brand-id': brand_id }, 'Model'))
		
			if(MODE == 'CACHE'){
				await this.fetchYear(brand_id, id)
			}
		}
	}
	catch(e){
		console.log(url)
		console.log(response)
		console.log(e)
	}	
}

ParserVehicleOptions.prototype.fetchYear = async function(brand_id, model_id){

	const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand_id}/modelos/${model_id}/anos`

	let response

	try{
		response = await fetch(url)
		const data = await response.json()

		for(let x in data){
			let year = data[x]

			let id = year.codigo

			/*
				as the model_id seems to be universally unique id I do not need keep brand data.
			*/
			let details = await this.fetchDetails(brand_id, model_id, id)
			this.years.set(id, { year: year.nome, version: details.Combustivel })

			if(!this.yearsOut.has(model_id)){
				this.yearsOut.set(model_id, { data: [] })

			}

			this.yearsOut.get(model_id).data.push(global.rawItemToJSONAPI(id, this.years.get(id), 'Year'))						
		}
	}
	catch(e){
		console.log(e)
		console.log('Failed parsing: ' + url)
	}	
}

ParserVehicleOptions.prototype.fetchDetails = async function(brand_id, model_id, year_id){

	const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand_id}/modelos/${model_id}/anos/${year_id}`

	let response

	try{
		response = await fetch(url)
		const data = await response.json()

		return data
	}
	catch(e){
		console.log('Failed parsing: ' + url)
	}	
}


let singleton = new ParserVehicleOptions()

async function brands() {

	if(MODE == 'API'){
		await singleton.fetchBrands()
	}

	return singleton.brandsOut || { data: [] }
}

async function models(brand_id) {

	if(MODE == 'API'){
		await singleton.fetchModel(brand_id)
	}

	return singleton.modelsOut.get(brand_id) || { data: [] }
}

async function years(brand_id, model_id){

	if(MODE == 'API'){
		await singleton.fetchYear(brand_id, model_id)
	}

	return singleton.yearsOut.get(model_id) || { data: [] }
}

export {singleton as default, brands, models, years}