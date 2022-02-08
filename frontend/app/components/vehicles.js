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
	,bodyApi: null
	,tableApi: null

	,currentSelection: computed('selection', function (){ 

		let selection = this.selection

		if(!selection || selection.length == 0)
			return 'none' 
		else{
		    if (Array.isArray(selection)) {
		      return `Array: [${selection.map(row => row.vehicle).join(',')}]`;
		    } else {
		      let row = selection;
		      return `Single: ${row.vehicle}`;
		    }			
		}

	})

	,getApi: function(obj){
		console.log(obj)
	}

	,didInsertElement: function(){
		//if we are rendering it suppoused to be empty
		console.log(this.tableApi)
	}	

	,actions: {
		onRemove(){
			console.log('ahva')

			console.log(this.rows)
			console.log(this.selection)
			console.log(this)
			for(var x in this.selection){

				console.log(this.selection[x].vehicle)

				for(var y in this.rows){
					if(this.rows[y].vehicle == this.selection[x].vehicle){
						console.log(`Deleting... ${y} = ${this.rows[y].vehicle}`)
						this.rows.splice(y, 1)
						console.log(this.selection[x])						
					}
				}


			}

			console.log(this.rows)
		}
	}
})