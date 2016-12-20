import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import {Session} from '../../utils/session';


@inject(Router, Service, Session)
export class List {
    data = [];
    constructor(router, service, session) {
        this.router = router;
        this.service = service;
        this.session = session;
        this.filter = "";
        this.storeId = this.session.store._id;
    }

    activate() {
        this.getData();
    }
    
    getData() {
        this.service.search(this.storeId, this.filter)
            .then(data => { 
                this.data = data;
                for(var i of this.data) {
                    i.date = this.getStringDate(new Date(i.date));
                }
            })
    }
    
    view(data) {
        this.router.navigateToRoute('view', { id: data._id });
    }
    
    create() {
        this.router.navigateToRoute('create');
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
