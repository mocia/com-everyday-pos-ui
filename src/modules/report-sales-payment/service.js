import { inject, Lazy } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { RestService } from "../../utils/rest-service";


//const serviceUri = "sales/docs/sales";

const serviceUri = "sales/omzet-monitoring";
const serviceReportUri = "sales/docs/sales/reports";
export class Service extends RestService {
  constructor(http, aggregator, config, api) {
    super(http, aggregator, config, "pos");
  }

  // getAllSalesByFilter(store, dateFrom, dateTo, shift) {
  //   var endpoint = `${serviceUri}/${store}/${dateFrom}/${dateTo}/${shift}`;
  //   return super.get(endpoint);
  // }

  getAllSalesByFilter(store, dateFrom, dateTo, shift) {
    var endpoint = `${serviceUri}?storecode=${store}&dateFrom=${dateFrom}&dateTo=${dateTo}&shift=${shift}`;
    return super.get(endpoint);
  }

  // generateExcel(storeId, dateFrom, dateTo, shift) {
  //   var query = '';
  //   if (dateFrom) {
  //     if (query == '') query = `dateFrom=${dateFrom}`;
  //     else query = `${query}&dateFrom=${dateFrom}`;
  //   }
  //   if (dateTo) {
  //     if (query == '') query = `dateTo=${dateTo}`;
  //     else query = `${query}&dateTo=${dateTo}`;
  //   }
  //   if (shift) {
  //     if (query == '') query = `shift=${shift}`;
  //     else query = `${query}&shift=${shift}`;
  //   }

  //   var endpoint = `${serviceReportUri}/${storeId}/${dateFrom}/${dateTo}/${shift}`;

  //   return super.getXls(endpoint);
  // }

  generateExcel(store, dateFrom, dateTo, shift) {
    var endpoint = `${serviceUri}/download?storecode=${store}&dateFrom=${dateFrom}&dateTo=${dateTo}&shift=${shift}`;

  // generateExcel(storeId, dateFrom, dateTo, shift) {
  //   var endpoint = `${serviceReportUri}/${storeId}/${dateFrom}/${dateTo}/${shift}`;
  //   return super.getXls(endpoint);
  // }

  
    return super.getXls(endpoint);
  }
}
