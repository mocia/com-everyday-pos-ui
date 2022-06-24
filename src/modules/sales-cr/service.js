import { inject, Lazy } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { RestService } from "../../utils/rest-service";

import { Container } from "aurelia-dependency-injection";
import { Config } from "aurelia-api";
import { isMoment } from "../../../node_modules/moment/moment";
import moment from "moment";

const serviceUri = "sales-docs";
const serviceUriStore = "sales-docs/readbystore";
const serviceUriStoreMaster = "master/stores";
const serviceUriSalesVoids = "sales/docs/salesvoids";
const serviceUriBank = "master/banks";
const serviceUriCardType = "master/card-types";
const serviceUriPromo = "sales/promos";
//const serviceUriFinishedgood = 'master/finishedgoods';
const serviceUriFinishedgood = "items/finished-goods";

export class Service extends RestService {
  constructor(http, aggregator, config, api) {
    super(http, aggregator, config, "pos");
    // this.http = http;
  }

  search(storeId, keyword) {
    var endpoint = `${serviceUriStore}/${storeId}?keyword=${keyword}`;
    return super.get(endpoint);
  }

  getStore(storeId) {
    var config = Container.instance.get(Config);
    var endpoint =
      config.getEndpoint("core").client.baseUrl +
      serviceUriStoreMaster +
      "/store-storage?code=" +
      `${storeId}`;
    //var endpoint = `${serviceUriStoreMaster}/${storeId}`;
    return super.get(endpoint);
  }

  getById(id) {
    var endpoint = `${serviceUri}/${id}`;
    return super.get(endpoint);
  }

  async getSalesVoidsByCode(storeId, code) {
    //var endpoint = `${serviceUriSalesVoids}?code=${code}`;
    var endpoint = `${serviceUri}/void-by-code?code=${code}&storecode=${storeId}`;
    return super.get(endpoint);
  }

  create(data) {
    // var endpoint = `${serviceUri}`;
    // var header;
    // var request = {
    //     method: 'POST',
    //     headers: new Headers(Object.assign({'Content-type' : 'application/json'}, this.header, header)),
    //     body: JSON.stringify(data)
    // };
    // var postRequest = this.endpoint.client.fetch(endpoint, request);
    // // var postRequest = this.service.post(endpoint, data);
    // this.publish(postRequest);
    // return postRequest
    //     .then(response => {
    //         console.log(response);
    //         return response.json().then(result => {
    //             console.log(result)
    //             result.id = response.headers.get('Id');
    //             this.publish(postRequest);
    //             if (result.error) {
    //                 return Promise.reject(result.error);
    //             }
    //             else {
    //                 return Promise.resolve(result.data);
    //             }
    //         });
    //     });
    var endpoint = `${serviceUri}`;
    return super.post(endpoint, data);
  }

  // getBank() {
  //     return super.get(serviceUriBank);
  // }

  getBank() {
    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("core").client.baseUrl + serviceUriBank;
    return super.get(endpoint);
  }

  getCardType() {
    var config = Container.instance.get(Config);
    var endpoint =
      config.getEndpoint("core").client.baseUrl + serviceUriCardType;
    return super.get(endpoint);
  }

  getPromoByStoreDatetimeItemQuantity(storeId, datetime, itemId, quantity) {
    datetime = moment(datetime);
    var endpoint = `${serviceUriPromo}/${storeId}/${datetime.format(
      "MMMM Do YYYY, h:mm:ss a"
    )}/${itemId}/${quantity}`;
    return super.get(endpoint);
  }

  getPromoNow(datetime, storeId) {
    var endpoint = `${serviceUriPromo}/all/${datetime}/${storeId}`;
    return super.get(endpoint);
  }

  getProductByCode(code) {
    var config = Container.instance.get(Config);
    //var endpoint = `${serviceUriFinishedgood}/code/${code}`;
    var endpoint =
      config.getEndpoint("core").client.baseUrl +
      serviceUriFinishedgood +
      "/code-discount/" +
      `${code}`;
    return super.get(endpoint);
  }

  getProductOnDiscount(thisDay) {
    thisDay = moment(thisDay).format("YYYY-MM-DD HH:mm");
    var config = Container.instance.get(Config);
    var endpoint =
      config.getEndpoint("inventory").client.baseUrl +
      "master-discount/filter/date/" +
      thisDay;
    return super.get(endpoint);
  }

  getProductOnDiscount(thisDay, productBarcode) {
    thisDay = moment(thisDay).format("YYYY-MM-DD HH:mm");
    // var config = Container.instance.get(Config);
    // var endpoint = config.getEndpoint("inventory").client.baseUrl + "master-discount/filter/date/"  + thisDay + "/code/" + productBarcode;
    var endpoint = `discount/code?code=${productBarcode}&date=${thisDay}`;
    return super.get(endpoint);
  }

  getItemInInventoryByCode(code, sourceId) {
    var config = Container.instance.get(Config);
    var endpoint =
      config.getEndpoint("inventory").client.baseUrl +`inventory/code?`+
      `itemData=${code}&source=${sourceId}`;
    return super.get(endpoint);
  }

  getProductById(Id) {
    var config = Container.instance.get(Config);
    //var endpoint = `${serviceUriFinishedgood}/code/${code}`;
    var endpoint =
      config.getEndpoint("core").client.baseUrl +
      serviceUriFinishedgood +
      `/${Id}`;
    return super.get(endpoint);
  }
}
