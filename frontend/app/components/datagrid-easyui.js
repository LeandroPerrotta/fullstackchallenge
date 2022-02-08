import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({

	g_components: service('globalcomponents')
	,store: service()

	/* Because we need know the index of item we are editing to make things faster */
	,editIndex: -1
	,newIndexRow: false
	,emitOnChange: true

	,dg: null

	,getColumns: function() {

		let self = this		
		return [
		    { title: '#', field: 'id', width: 20 },
			{ title: 'Placa', field: 'plate', width: 180, editor:{type:'textbox'} },
		    { title: 'Marca', field: 'brand', width: 180, editor:{
	            type:'combobox',
	            options:{
	                valueField:'id',
	                textField:'brand',
	                required: true,
	                data: this.getBrands()
	                ,onChange: async function(newvalue, oldvalue){

	                	if(self.emitOnChange && newvalue != null && self.editIndex != -1){

					        var ed = self.dg.datagrid('getEditor', {
					            index: self.editIndex,
					            field: 'model'
					        });

					        self.dg.datagrid('loading')

					        let rows = await self.getModels(newvalue)    

					        $(ed.target).combobox('clear');	                		
					        $(ed.target).combobox('loadData', rows);	                		
					        $(ed.target).combobox('enable');	  
					        self.dg.datagrid('loaded')              		

	                	}
	                }
	            }
	        } },
		    { title: 'Modelo', field: 'model', width: 180, editor:{
	            type:'combobox',
	            options:{
	                valueField:'id',
	                textField:'model',
	                required:true,
	                disabled: true
					,onChange: async function(newvalue, oldvalue){

	                	if(self.emitOnChange && newvalue != null && self.editIndex != -1){


					        var ed = self.dg.datagrid('getEditor', {
					            index: self.editIndex,
					            field: 'year'
					        });

					        var ed_brand = self.dg.datagrid('getEditor', {
					            index: self.editIndex,
					            field: 'brand'
					        });

					        self.dg.datagrid('loading')

					        let rows = await self.getYears($(ed_brand.target).combobox('getValue'), newvalue)

					        $(ed.target).combobox('clear');	  
					        $(ed.target).combobox('loadData', rows);	                		
					        $(ed.target).combobox('enable');
					        self.dg.datagrid('loaded')    	                		

	                	}
	                }	                
	            }
	        } },
		    { title: 'Ano', field: 'year', width: 180, editor:{
	            type:'combobox',
	            options:{
	                valueField:'id',
	                textField:'year',
	                required:true,
	                disabled: true
					,onChange: async function(newvalue, oldvalue){

	                	if(self.emitOnChange && newvalue != null && self.editIndex != -1){

							let year = await self.store.peekRecord('year', newvalue)           		

							if(year){
						        var ed = self.dg.datagrid('getEditor', {
						            index: self.editIndex,
						            field: 'version'
						        });     

						        $(ed.target).textbox('setText', year.version);    
					        } 		
	                	}
	                }	                
	            }
	        } },	        
		    { title: 'Versão', field: 'version', width: 180, editor:{type:'textbox', options: { readonly: true }} },
		    { title: 'Cor', field: 'color', width: 180, editor:{type:'textbox'} },
	  	]
	}

  	,datagridId: ''

	,rows: []

	,getRows: function() { 

		let rows = this.rows
		return rows
  	}

	,getBrands: function(){
		let rows = []

		this.store.peekAll('brand').forEach((brand) => {
			rows.push(brand.serializeCombobox)
		}) 		

		
		return rows
	}

	,getModels: async function(brand_id){

		let rows = []

		let list = await this.store.query('model', {
		  filter: {
		    'brand-id': brand_id
		  }
		})

		list.forEach((model) => {
			rows.push(model.serializeCombobox)
		})

		return rows
	}

	,getYears: async function(brand_id, model_id){
		let rows = []

		let list = await this.store.query('year', {
		  filter: {
		    'model-id': model_id
		    ,'brand-id': brand_id
		  }
		})

		list.forEach((model) => {
			rows.push(model.serializeCombobox)
		})

		return rows
	}

	,didInsertElement: function(){
		//if we are rendering it suppoused to be empty
		this.rows = []

		this.store.peekAll('vehicle').forEach((vehicle) => {
			this.rows.push(vehicle.serializeDatagrid)
		})

		this.g_components.add(this)

		let self = this
		this.dg = $(this.element).find('#easyui_dg').datagrid({
			columns: [this.getColumns()]
			,data: this.getRows()
			,height: 450
			,width: '100%'
			,onEndEdit: (index, row) => { 
				self.onEndEdit(index, row) 
			} 
		})
	}

	,updateDatagrid: function(){
		//if we are rendering it 
		this.rows = []

		this.store.peekAll('vehicle').forEach((vehicle) => {
			this.rows.push(vehicle.serializeDatagrid)
		})

		this.dg = this.dg.datagrid('loadData', this.getRows())
	}

	,onEndEdit: async function(index, row){

		/* Its to save in the cell the label of item instead the id */
		/* I dont want it emmit onChange on the components while this happening */ 
		this.emitOnChange = false
		let columns = this.getColumns()
		for(var i in columns){

			let column = columns[i]

			if(column.editor){
		        var ed = this.dg.datagrid('getEditor', {
		            index: index,
		            field: column.field
		        });

				if(column.editor.type == 'combobox'){
			        row[column.field] = $(ed.target).combobox('getText');
				}
				else if(column.editor.type == 'textbox'){
					row[column.field] = $(ed.target).textbox('getText')
				}
			}
		}

		let selected = row
    	let success = false

    	if(!this.isNewIndex){
    		try{
        		let vehicle = await this.store.peekRecord('vehicle', selected.id)

        		vehicle.setProperties(selected)
        		let ret = await vehicle.save()
        		success = true
    		}
    		catch(e){
    			let hasError = e.errors && e.errors[0] && e.errors[0].detail
    			if(hasError){
    				$.messager.alert('Ooops!', e.errors[0].detail,'info');
    			}
    			else{
    				$.messager.alert('Ooops!','O registro não pode ser inserido!','info');
    			}
    		}
    	}
    	else{
    		try{
        		let vehicle = this.store.createRecord('vehicle', selected)

        		let ret = await vehicle.save()

    			//here comes some workaround because Ember is not able to fill up model's ID for the 
    			//just created entry with the ID sent back from API.
    			//for this reason, we must reload whole datagrid, instead just update the new row
    			await this.store.unloadAll('vehicle')
    			await this.store.findAll('vehicle', { reload: true })
    			this.updateDatagrid()
        		
        		success = true
    		}
    		catch(e){
    			let hasError = e.errors && e.errors[0] && e.errors[0].detail
    			if(hasError){
    				$.messager.alert('Ooops!', e.errors[0].detail,'info');
    			}
    			else{
    				$.messager.alert('Ooops!','O registro não pode ser inserido!','info');
    			}
    		}
    	}

    	if(success){
            
            this.editIndex = -1;
            this.isNewIndex = false

            this.updateButtonsBar()	
        }
        else{
        	//if something goes wrong then we back to editing condition
        	this.dg.datagrid('beginEdit', this.editIndex);
        }	

        this.emitOnChange = true
	}

	,onTransition: function(){
		if(this.editIndex != -1){
			this.doRejectChanges()
		}
	}

	,doRejectChanges: function(){
		this.dg.datagrid('rejectChanges');
    	this.editIndex = -1;

    	if(this.isNewIndex){
    		this.rows.pop()
    		this.isNewIndex = false
    	}
	}

	,doRemove: async function(){
		if(this.editIndex == -1){
			let selection = this.dg.datagrid('getSelections')

			if(selection.length > 0){

				for(let row of selection){
					let index = this.dg.datagrid('getRowIndex', row)

					try{
						await this.store.peekRecord('vehicle', row.id).destroyRecord()
						this.dg.datagrid('deleteRow', index)
					}catch(e){
						$.messager.alert('Ooops!','O registro não pode ser deletado!','info');
						break;
					}
				}
			}
			else{
				$.messager.alert('Ooops!','Selecione primeiro um item.','info');
			}
		}
		else{
			this.doRejectChanges()
        }

        this.updateButtonsBar()		
	}

	,onRemove: function(){
		if(this.editIndex == -1){
			let selection = this.dg.datagrid('getSelections')

			let self = this
			$.messager.confirm({
				title: 'Atenção:',
				msg: `Você irá remover ${selection.length} registros. Confirmar?`,
				fn: function(r){
					if (r){
						self.doRemove()
					}
				}
			});
		}
		else{
       		this.doRejectChanges()
        	this.updateButtonsBar()		
        }
	},

	onEdit: function(){

		let selected = this.dg.datagrid('getSelected')
		let index = this.dg.datagrid('getRowIndex', selected)		

		if (this.editIndex != index){
            if (this.endEditing()){
                this.dg.datagrid('selectRow', index)
                    .datagrid('beginEdit', index);

                this.editIndex = index;
            } else {
                setTimeout(function(){
                    this.dg.datagrid('selectRow', this.editIndex);
                },0);
            }
        }
        else{
        	this.endEditing()
        }		

        this.updateButtonsBar()	
	},

	onAdd: function(){
        if (this.endEditing()){

        	this.dg.datagrid('clearSelections')

           	let rows = this.dg.datagrid('getRows')

            this.dg.datagrid('appendRow', {});

            this.editIndex = rows.length - 1;
            this.isNewIndex = true

            this.dg.datagrid('selectRow', this.editIndex)
                .datagrid('beginEdit', this.editIndex);
        }	

        this.updateButtonsBar()		
	},


	endEditing: function(){
        if (this.editIndex == -1) {return true}
        if (this.dg.datagrid('validateRow', this.editIndex)){

        	//we must call endEdit to get updated values
        	this.dg.datagrid('endEdit', this.editIndex);
            return true;
        } else {
            return false;
        }	
	},

	updateButtonsBar: function(){

		let editBtn = $('#editBtn')
		let addBtn = $('#addBtn')
		let remBtn = $('#remBtn')

		if(this.editIndex == -1){
			addBtn.prop('disabled', false)

			editBtn.html('Editar')
			remBtn.html('Remover')
		}
		else{
			addBtn.prop('disabled', true)

			editBtn.html('Salvar')			
			remBtn.html('Desfazer')			
		}
	}
})