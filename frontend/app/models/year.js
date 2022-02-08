import Model, { attr } from '@ember-data/model';

export default class YearModel extends Model {
	@attr('string') year;
	@attr('number') 'model-id';
	@attr('string') version;

	get serializeCombobox(){
		return {
			id: this.id
			,year: this.year
		}
	}	
}
