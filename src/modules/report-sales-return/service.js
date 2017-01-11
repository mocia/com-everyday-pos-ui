import {inject, Lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {RestService} from '../../utils/rest-service';
  
const serviceUri = 'sales/docs/salesreturns';
export class Service extends RestService{
  
  constructor(http, aggregator,config,api) {
    super(http, aggregator,config,"pos");
  } 

  getAllSalesReturnByFilter(store, dateFrom, dateTo, shift)
  {
    var endpoint = `${serviceUri}/${store}/${dateFrom}/${dateTo}/${shift}`;
    return super.get(endpoint);
  } 
}
