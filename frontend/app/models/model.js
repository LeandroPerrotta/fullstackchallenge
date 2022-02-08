import Model, { attr } from '@ember-data/model';

export default class ModelModel extends Model {
	@attr('string') model;
	@attr('number') 'brand-id';

	get serializeCombobox(){
		return {
			id: this.id
			,model: this.model
		}
	}	
}
