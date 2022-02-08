import { A } from '@ember/array';
import Service from '@ember/service';

/* Its because I can get really upset when things start not letting me do what I want to do */
/* And the components really need know when things happens :[ */ 
export default class GlobalComponents extends Service {
  components = A([]);

  add(item) {
    this.components.pushObject(item);
  }

  remove(item) {
    this.components.removeObject(item);
  }

  empty() {
    this.components.clear();
  }
}