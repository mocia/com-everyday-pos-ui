import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import {LocalStorage} from '../../utils/storage';


@inject(Router, Service, LocalStorage)
export class List {
    data = [];
    constructor(router, service, localStorage) {
        this.router = router;
        this.service = service;
        this.filter = "";

        this.localStorage = localStorage;

        this.storeId = this.localStorage.store._id;
        this.storecode = this.localStorage.store.code;
        // this.storeId = this.session.store._id;
    }

    activate() {
        this.getData();
    }

    view(data) {
        this.router.navigateToRoute('view', { id: data.Id });
    }
    
    create() {
        this.router.navigateToRoute('create');
    }
    
    getData() {
        this.service.search(this.storecode, this.filter)
            .then(data => { 
                this.data = data; 
                for(var i of this.data) {
                    i.Date = this.getStringDate(new Date(i.Date));
                }
            })
    }
    
    filterData() {
        this.getData();
    }
    
    getStringDate(date) { 
        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0! 
        var yyyy = date.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        date = yyyy+'-'+mm+'-'+dd;
        return date; 
    }
}
