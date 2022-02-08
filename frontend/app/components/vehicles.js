import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({

	store: service()

	,columns: [
	    { name: '#', valuePath: 'id', width: 180 },
	    { name: 'Placa', valuePath: 'plate', width: 180 },
	    { name: 'Marca', valuePath: 'brand', width: 180 },
	    { name: 'Modelo', valuePath: 'model', width: 180 },
	    { name: 'Versão', valuePath: 'version', width: 180 },
	    { name: 'Ano', valuePath: 'year', width: 180 },
	    { name: 'Cor', valuePath: 'color', width: 180 },
	  ]

	,rows: []

	,getRows: computed('rows', function() { 

		this.rows = []

		this.store.peekAll('vehicle').forEach((vehicle) => {
			this.rows.push(vehicle.serializeDatagrid)
		})

		console.log(this.rows)

		return this.rows
	  })

	,selection: null
})