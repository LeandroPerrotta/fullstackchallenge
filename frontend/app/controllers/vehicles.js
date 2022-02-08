import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class VehiclesController extends Controller {

	@action
	reload(){
		console.log('Controller')
		//this.refresh()
	}
}
