import Model, { attr } from '@ember-data/model';

export default class VehicleModel extends Model {
	@attr('string') plate;
	@attr('string') brand;
	@attr('string') model;
	@attr('string') version;
	@attr('string') year;
	@attr('string') color;

	get serializeDatagrid(){
		return {
			id: this.id
			,plate: this.plate
			,brand: this.brand
			,model: this.model
			,version: this.version
			,year: this.year
			,color: this.color
		}
	}
}
