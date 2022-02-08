import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({

  g_components: service('globalcomponents')

  ,async model(){
    return await this.store.findAll('vehicle') && await this.store.findAll('brand')
  }

  ,actions: {
    willTransition(transition){

      //garbage collector
      for(var i in this.g_components.components){
        let component = this.g_components.components[i]

        if(component.onTransition != undefined){
          component.onTransition()
        }
      }

      this.g_components.empty()

      return true
    }
  }
});