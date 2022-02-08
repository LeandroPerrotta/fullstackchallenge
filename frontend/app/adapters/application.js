import JSONAPIAdapter from '@ember-data/adapter/json-api';
//import RESTAdapter from '@ember-data/adapter/rest';
import { get } from '@ember/object';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = 'http://127.0.0.1:8080';
}