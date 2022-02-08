import Model, { attr } from '@ember-data/model';

export default class BrandModel extends Model {
	@attr('string') brand;

	get serializeCombobox(){
		return {
			id: this.id
			,brand: this.brand
		}
	}	
}
