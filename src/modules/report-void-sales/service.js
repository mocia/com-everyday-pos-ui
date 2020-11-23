import {inject, Lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {RestService} from '../../utils/rest-service';

import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"

const serviceUri =  'sales/sales-void';
const serviceUriStore = 'master/stores';
const serviceUriTransferInDoc ='inventory/docs/transfer-in';

export class Service extends RestService {

  constructor(http, aggregator,config, api) {
    super(http, aggregator,config,"pos");
  }

  getAllSalesByFilter(args) {
    var endpoint = `${serviceUri}?storeCode=${args.storeCode}&&dateFrom=${args.dateFrom}&&dateTo=${args.dateTo}&&shift=${args.shift}`;
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
    var endpoint = config.getEndpoint("inventory") + `'/storages'}/${id}`;
    // var endpoint = `${require('../../host').inventory + '/storages'}/${id}`;
    return super.get(endpoint);
  }

  getStore() {
    return super.get(serviceUriStore);
  }

}
