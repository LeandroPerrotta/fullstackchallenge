import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

var controller = Controller.extend({

	g_components: service('globalcomponents')

	,actions:{
		onRemove: function(){

			for(var i in this.g_components.components){
				let component = this.g_components.components[i]

				if(component.onRemove != undefined){
					component.onRemove()
				}
			}
		},

		onEdit: function(){

			for(var i in this.g_components.components){
				let component = this.g_components.components[i]

				if(component.onEdit != undefined){
					component.onEdit()
				}
			}				
		},

		onAdd: function(){

			for(var i in this.g_components.components){
				let component = this.g_components.components[i]

				if(component.onAdd != undefined){
					component.onAdd()
				}
			}				
		}
	}
})

export default controller
