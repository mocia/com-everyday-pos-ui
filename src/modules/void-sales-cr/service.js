import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../utils/rest-service';

const serviceUri = 'sales-docs';
const serviceUriStoreSales = 'sales-docs/readbystore';
const serviceUriUpdate = 'sales/docs/sales';
const serviceUriBank = 'master/banks';
const serviceUriCardType = 'master/cardtypes';
const serviceUriPromo = 'sales/promos';
const serviceUriStore = 'master/stores';
// const serviceUriTransferInDoc = 'inventory/docs/transfer-in';


export class Service extends RestService {

    constructor(http, aggregator, config, api) {
        super(http, aggregator, config, "pos");
    }

    search(storeId, keyword) {
        var endpoint = `${serviceUriStoreSales}/${storeId}?filter=${keyword}`;
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

    // update(data) {
    //     var endpoint = `${serviceUri}`;
    //     return super.put(endpoint, data);
    // } 

    delete(data) {
        var endpoint = `${serviceUri}`;
        return super.del(endpoint, data);
    }

    voidSales(data) {
        var endpoint = `${serviceUri}/${data.Id}`;
        return super.put(endpoint, data);
    }

    getBank() {
        return super.get(serviceUriBank);
    }

    getCardType() {
        return super.get(serviceUriCardType);
    }

    getStore() {
        return super.get(serviceUriStore);
    }

    getTrans() {
        return super.get(serviceUri);
    }

    getTransByStoreName(storename, isTransByStoreName) {
        var endpoint = `${serviceUri}/${storename}/${isTransByStoreName}`;
        return super.get(endpoint);
    }

    getPromoByStoreDatetimeItemQuantity(storeId, datetime, itemId, quantity) {
        var endpoint = `${serviceUriPromo}/${storeId}/${datetime}/${itemId}/${quantity}`;
        return super.get(endpoint);
    }

    createTransferIn(data) {
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("inventory") + "docs/transfer-in";
        // var endpoint = `${serviceUriTransferInDoc}`;
        return super.post(endpoint, data);
    }

    getOutByCode(code) {
        var endpoint = `${serviceUri}?keyword=${code}`;
        return super.get(endpoint);
    }
}
