import {inject, Lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {RestService} from '../../utils/rest-service';

import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"

const serviceUri =  'sales/docs/sales';
const Uri ='sales/payment-method';
const serviceUriStore =   'master/stores';
// const serviceUriTransferInDoc =  'inventory/docs/transfer-in';

export class Service extends RestService {

  constructor(http, aggregator,config,api) {
    super(http, aggregator,config,"pos");
  }

  getAllSalesByFilter(store, dateFrom, dateTo, shift) {
    // var endpoint = `${serviceUri}/${store}/${dateFrom}/${dateTo}/${shift}`;
   var endpoint = `${Uri}?storecode=${store}&dateFrom=${dateFrom}&dateTo=${dateTo}&shift=${shift}`;
    return super.get(endpoint);
  }

  search(keyword) {
    return super.get(serviceUri);
  }

  getAll() {
    var endpoint = `${serviceUri}`;
    return super.get(endpoint);
  }


  getById(id) {
    var endpoint = `${serviceUri}/${id}`;
    return super.get(endpoint);
  }

  create(data) {
    var endpoint = `${serviceUri}`;
    return super.post(endpoint, data);
  }

  getModuleConfig() {
    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("core") + '/modules?keyword=EFR-KB/EXB';

    // var endpoint = require('../../host').core + '/modules?keyword=EFR-KB/EXB';
    return super.get(endpoint)
      .then(results => {
        if (results && results.length == 1)
          return Promise.resolve(results[0].config);
        else
          return Promise.resolve(null);
      });
  }

  getStorageById(id) {
    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("inventory")+ `'/storages'}/${id}`;
    // var endpoint = `${require('../../host').inventory + '/storages'}/${id}`;
    return super.get(endpoint);
  }

  getStore(storeId) {
    var config = Container.instance.get(Config);

    var endpoint = config.getEndpoint("core").client.baseUrl+'master/stores?keyword='+storeId;
    return super.get(endpoint);
  }

  createTransferIn(data) {
    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("inventory") + "docs/transfer-in";
    // var endpoint = `${serviceUriTransferInDoc}`;
    return super.post(endpoint, data);
  }
}
