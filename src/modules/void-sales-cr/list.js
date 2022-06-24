import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import {LocalStorage} from '../../utils/storage';


@inject(Router, Service,LocalStorage)
export class List {
    data = [];
    constructor(router, service,localStorage) {
        this.router = router;
        this.service = service;
        this.localStorage = localStorage;
        this.storeId = this.localStorage.store._id;
        this.storeCode = this.localStorage.store.code;
        this.filter = "";
        // this.storeId = this.session.store._id;
    }

    activate() { 
        var filter = JSON.stringify({
            isVoid : true
        })
        this.service.search(this.storeCode, filter)
            .then(data => { 
                this.data = data;
                for(var i of this.data) {
                    i._LastModifiedUtc = this.getStringDate(new Date(i._LastModifiedUtc));
                }
            })
    }

    view(data) {
        this.router.navigateToRoute('view', { id: data._id });
    }
    
    create() {
        this.router.navigateToRoute('create');
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
