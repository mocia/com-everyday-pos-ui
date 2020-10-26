import {inject, bindable, BindingEngine} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import {LocalStorage} from '../../utils/storage';


var VoidLoader = require('../../loader/sales-void-loader');

@inject(Router, Service, BindingEngine, LocalStorage)
//@inject(Router, Service, BindingEngine)
export class DataForm {
    @bindable data = {};
    @bindable error = {};
    @bindable selectedvoid;

    salesApiUri = 'sales/docs/sales';

    // constructor(router, service, bindingEngine) {
    //     this.router = router;
    //     this.service = service;
        
    //     this.bindingEngine = bindingEngine;
        
    // }

    constructor(router, service, bindingEngine, localStorage) {
        this.router = router;
        this.service = service;
        this.localStorage = localStorage;
        this.bindingEngine = bindingEngine;
        this.storecode = this.localStorage.store.code;
    }

    attached() {
        // this.bindingEngine.collectionObserver(this.data.items)
        //     .subscribe(splices => {
        //         var index = splices[0].index;
        //         var item = this.data.items[index];
        //         this.bindingEngine.propertyObserver(item, "salesId").subscribe((newValue, oldValue) => {
        //             //ambil service lagi
        //             this.service.getById(item.salesId)
        //                 .then(dataSales => {
        //                     item.code = dataSales.code;
        //                     item.storeName = dataSales.store.name;
        //                     item.grandTotal = dataSales.grandTotal;
        //                     item._createdBy = dataSales._createdBy;
        //                     item.date = this.getStringDate(new Date(dataSales.date));
        //                 })
        //         });
        //     });
    }

    getStringDate(date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0! 
        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        date = yyyy + '-' + mm + '-' + dd;
        return date;
    }

    addItem() {
        var item = {};
        this.data.items.push(item);
    }

    removeItem(item) {
        var itemIndex = this.data.items.indexOf(item);
        this.data.items.splice(itemIndex, 1);
    }
    // selectedvoidChanged(newvalue, oldValue){
    //     console.log(oldValue);
    //     if (newvalue) {
            
    //         this.data.items.salesId = newvalue.Id;
    //         this.data.items.code = newvalue.Code;
    //         this.data.items.storeName = newvalue.StoreName;
    //         this.data.items.grandTotal = newvalue.GrandTotal;
    //         this.data.items._createdBy = newvalue._CreatedBy;
    //         this.data.items.date = this.getStringDate(new Date(newvalue.Date));
    //     }
    //     console.log(this.data.items);

    // }
    selectedvoidChanged(e, item){
            console.log(item);
            if (e) {
                
                this.data.items.salesId = newvalue.Id;
                this.data.items.code = newvalue.Code;
                this.data.items.storeName = newvalue.StoreName;
                this.data.items.grandTotal = newvalue.GrandTotal;
                this.data.items._createdBy = newvalue._CreatedBy;
                this.data.items.date = this.getStringDate(new Date(newvalue.Date));
            }
            console.log(this.data.items);
    
    }
    salesChanged(e, item) {
        var sales = e.detail;
        if (sales) {
            item.salesId = sales.Id;
            item.code = sales.code;
            item.storeName = sales.store.Name;
            item.grandTotal = sales.grandTotal;
            item._createdBy = sales._CreatedBy;
            item.date = this.getStringDate(new Date(sales.date));
        }
        console.log(this.data.items);
    }
    get voidLoader(){
        return VoidLoader;
    }

    get voidquery(){
        var supp = {"StoreCode":this.storecode}
        
        return supp;
    }
}
