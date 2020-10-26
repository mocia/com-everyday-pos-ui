import {inject, Lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {RestService} from '../../utils/rest-service';
import { Config } from "aurelia-api";
import moment from 'moment';
import { Container } from 'aurelia-dependency-injection';
//const serviceUri = 'sales-docs';
// const serviceUri = 'sales/docs/salesreturns';
// const serviceUriStore = 'store';
// const serviceUriStoreMaster = 'master/stores';
// const serviceUriBank = 'master/banks';
// const serviceUriCardType = 'master/cardtypes';
// const serviceUriPromo = 'sales/promos'; 
// const serviceUriFinishedgood = 'master/finishedgoods';

const serviceUri = 'sales-docs-return';
const serviceUriStore = 'sales-docs-return/readbystore';
const serviceUriStoreMaster = 'master/stores';
const serviceUriSalesVoids = 'sales/docs/salesvoids';
const serviceUriBank = 'master/banks';
const serviceUriCardType = 'master/card-types';
const serviceUriPromo = 'sales/promos';
const serviceUriInven = 'inventory'
//const serviceUriFinishedgood = 'master/finishedgoods';
const serviceUriFinishedgood = 'items/finished-goods';

export class Service extends RestService {

    constructor(http, aggregator,config,api) {
        super(http, aggregator,config,"pos");
    }

    search(storeId, keyword) {
        var endpoint = `${serviceUriStore}/${storeId}?keyword=${keyword}`;
        return super.get(endpoint);
    }
    
    getById(id) {
        var endpoint = `${serviceUri}/${id}`;
        return super.get(endpoint);
    }

    getStore(storeId) {
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("core").client.baseUrl + serviceUriStoreMaster + "/store-storage?code=" + `${storeId}`
        //var endpoint = `${serviceUriStoreMaster}/${storeId}`;
        return super.get(endpoint);
    }

    getStore2(storeId) {
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("core").client.baseUrl + serviceUriStoreMaster + "/code?code=" + `${storeId}`
        //var endpoint = `${serviceUriStoreMaster}/${storeId}`;
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
        // this.publish(postRequest);
        // return postRequest
        //     .then(response => { 
        //         return response.json().then(result => {
        //             result.id = response.headers.get('Id'); 
        //             this.publish(postRequest);
        //             if (result.error) {
        //                 return Promise.reject(result.error);
        //             }
        //             else {
        //                 return Promise.resolve(result.id);
        //             }
        //         }); 
        //     });
        var endpoint = `${serviceUri}`;
        return super.post(endpoint, data);
        // return super.post(endpoint, data);
    } 
    
    getBank() {
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("core").client.baseUrl + serviceUriBank
        return super.get(endpoint);
    }
    
    getCardType() {
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("core").client.baseUrl + serviceUriCardType
        return super.get(endpoint);
    }
    
    getPromoByStoreDatetimeItemQuantity(storeId, datetime, itemId, quantity) {
        datetime = moment(datetime);
        var endpoint = `${serviceUriPromo}/${storeId}/${datetime.format('MMMM Do YYYY, h:mm:ss a')}/${itemId}/${quantity}`;
        return super.get(endpoint);
    }
    
    getProductByCode(code) {
        var config = Container.instance.get(Config);
        //var endpoint = `${serviceUriFinishedgood}/code/${code}`;
        var endpoint = config.getEndpoint("core").client.baseUrl + serviceUriFinishedgood + "/code-discount/" + `${code}`
        return super.get(endpoint);
    }

    getPromoNow(datetime, storeId) {
        var endpoint = `${serviceUriPromo}/all/${datetime}/${storeId}`;
        return super.get(endpoint);
    }

    getStock(itemCode, StorageCode){
        console.log(itemCode)
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("inventory").client.baseUrl + serviceUriInven + "/stock-pos?source=" + `${StorageCode}` + "&itemId=" + `${itemCode}`
        return super.get(endpoint);
    }
}
