import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({

  g_components: service('globalcomponents')

  ,async model(){
    return await this.store.findAll('vehicle') && await this.store.findAll('brand')
  }

  ,actions: {
    willTransition(){
      //garbage collector
      this.g_components.empty()
      return true
    }
  }
});