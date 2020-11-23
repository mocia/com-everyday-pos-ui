import {inject, Lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {RestService} from '../../utils/rest-service';
  
const serviceUri = 'sales/sales-return';
export class Service extends RestService{
  
  constructor(http, aggregator,config,api) {
    super(http, aggregator,config,"pos");
  } 

  getAllSalesReturnByFilter(store, dateFrom, dateTo, shift)
  {
    var endpoint = `${serviceUri}?storecode=${store}&dateFrom=${dateFrom}&dateTo=${dateTo}&shift=${shift}`;
    return super.get(endpoint);
  } 
}
