import {inject, Lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {RestService} from '../../utils/rest-service';

const serviceUri = 'sales/docs/salesreturns';
const serviceUriStore = 'store';
const serviceUriStoreMaster = 'master/stores';
const serviceUriBank = 'master/banks';
const serviceUriCardType = 'master/cardtypes';
const serviceUriPromo = 'sales/promos'; 
const serviceUriFinishedgood = 'master/finishedgoods';

export class Service extends RestService {

    constructor(http, aggregator,config,api) {
        super(http, aggregator,config,"pos");
    }

    search(storeId, keyword) {
        var endpoint = `${serviceUriStore}/${storeId}/sales/docs/salesreturns?keyword=${keyword}`;
        return super.get(endpoint);
    }
    
    getById(id) {
        var endpoint = `${serviceUri}/${id}`;
        return super.get(endpoint);
    }

    getStore(storeId) {
        var endpoint = `${serviceUriStoreMaster}/${storeId}`;
        return super.get(endpoint);
    }

    create(data) {
        var endpoint = `${serviceUri}`;
        var header;
        var request = {
            method: 'POST',
            headers: new Headers(Object.assign({'Content-type' : 'application/json'}, this.header, header)),
            body: JSON.stringify(data)
        };
        var postRequest = this.endpoint.client.fetch(endpoint, request);
        this.publish(postRequest);
        return postRequest
            .then(response => { 
                return response.json().then(result => {
                    result.id = response.headers.get('Id'); 
                    this.publish(postRequest);
                    if (result.error) {
                        return Promise.reject(result.error);
                    }
                    else {
                        return Promise.resolve(result.id);
                    }
                }); 
            });
        // return super.post(endpoint, data);
    } 
    
    getBank() {
        return super.get(serviceUriBank);
    }
    
    getCardType() {
        return super.get(serviceUriCardType);
    }
    
    getPromoByStoreDatetimeItemQuantity(storeId, datetime, itemId, quantity) {
        var endpoint = `${serviceUriPromo}/${storeId}/${datetime}/${itemId}/${quantity}`;
        return super.get(endpoint);
    }
    
    getProductByCode(code) {
        var endpoint = `${serviceUriFinishedgood}/code/${code}`;
        return super.get(endpoint);
    }
}
