import express from 'express'
const app = express()

import cors from 'cors'
const port = 8080

import DbConnector from './db.js'
global.db = new DbConnector('pgsql')

import IoVehicle from './io_vehicle.js'
global.io_vehicle = new IoVehicle()

import bodyParser from 'body-parser'

import { brands, models, years } from './parser_vehicle_options.js'

app.use(bodyParser.urlencoded({ 
  extended: true
})); 

/* need rewrite default header to JSON:API to understand Ember messages */
/* Hope it do not break things later */
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
//app.use(bodyParser.json());

app.use(cors())

function errorToJSONAPI(error){
   let jsonapi = {
    errors: [ error ]
  }

  return jsonapi 
}

global.rawItemToJSONAPI = function(id, data, type){

  let jsonapi = {
    id: id
    , attributes: data
    , type: type
  } 

  return jsonapi
}

app.get('/brands', async (req, res) => {
  let out = await brands()
  res.send(JSON.stringify(out))
})

app.get('/models', async (req, res) => {
  let out = await models(parseInt(req.query.filter['brand-id']))
  res.send(JSON.stringify(out))
})

app.get('/years', async (req, res) => {
  let out = await years(parseInt(req.query.filter['brand-id']), parseInt(req.query.filter['model-id']))
  res.send(JSON.stringify(out))
})

app.get('/vehicles', async (req, res) => {

  let out = await global.io_vehicle.listAll()
  res.send(JSON.stringify(out))
})

app.post('/vehicles', async (req, res) => {

  let vehicle = req.body.data

  let out = await io_vehicle.create(vehicle)

  if(typeof out == 'boolean' || !out.detail){
    if(out)
      res.status(201).send(JSON.stringify(out))     
    else
      res.sendStatus(404)
    }
  else{
    if(out.detail){
      res.status(400).send(JSON.stringify(errorToJSONAPI(out)))
    }
    else{
      res.status(404)  
    }
  }
})

app.delete('/vehicles/:id', async (req, res) => {

  let id = parseInt(req.params.id)

  if(await io_vehicle.delete(id)){
    res.sendStatus(204) 
  }
  else
    res.sendStatus(404)  
})

app.patch('/vehicles/:id', async (req, res) => {

  let id = parseInt(req.params.id)
  let vehicle = req.body.data

  let ret = await io_vehicle.update(id, vehicle)

  if(typeof ret == 'boolean' && ret){
    res.sendStatus(204) 
  }
  else{

    if(ret.detail){
      res.status(400).send(JSON.stringify(errorToJSONAPI(ret)))
    }
    else{
      res.status(404)  
    }
  }
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})