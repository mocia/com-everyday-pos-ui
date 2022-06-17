import { inject, Lazy, BindingEngine } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { LocalStorage } from '../../utils/storage';
import moment from 'moment';

@inject(Router, Service, BindingEngine, LocalStorage)
export class List {

    shifts = ["Semua", "1", "2"];

    constructor(router, service, bindingEngine, localStorage) {
        this.router = router;
        this.service = service;
        this.bindingEngine = bindingEngine;
        this.localStorage = localStorage;

        this.data = { filter: {}, results: [] };
        this.error = { filter: {}, results: [] };
        this.data.filter.dateFrom = new Date();
        this.data.filter.dateTo = new Date();
    }

    activate() {
    }

    attached() {
        this.data.filter.shift = 0;
        this.data.filter.storeId = this.localStorage.store._id;
        this.data.filter.store = this.localStorage.store;
        this.data.filter.storeCode = this.localStorage.store.code;
    }

    filter() {
        this.error = { filter: {}, results: [] };
        var datefrom = moment(this.data.filter.dateFrom).startOf('day');
        var dateto = moment(this.data.filter.dateTo).endOf('day');
        var storeCode = this.data.filter.storeCode;
        var shift = this.data.filter.shift;
        if (dateto < datefrom)
            this.error.filter.dateTo = "Tanggal From Harus Lebih Besar Dari To";
        else {
            
                let args = {
                    dateFrom : datefrom.format('YYYY-MM-DD'),
                    dateTo: dateto.format('YYYY-MM-DD'),
                    storeCode: storeCode,
                    shift: shift 
                }
             
            this.service.getAllSalesByFilter(args)
            .then(result => {

                    this.data.results = [];
                    for (var _data of result) {
                            var totalSubTotal = 0;
                                var tanggalRowSpan = 0;
                                var itemRowSpan = 0;
                                _data.date = moment(_data.date).format('YYYY-MM-DD');
                                _data.isVoid = _data.isVoid;
                                  
                                _data.barcode = _data.ItemCode;
                                _data.itemName = _data.ItemName;
                                _data.itemSize = _data.ItemSize;
                                _data.quantity = _data.Quantity;
                              
                                _data.subTotal = _data.TotalPrice
                                _data.shift = _data.shift;
                                _data._createdBy = _data._CreatedBy;
                                _data._updatedBy = _data._LastModifiedBy;
                                _data.itemRowSpan = itemRowSpan;
                                totalSubTotal += parseInt(_data.subTotal);
                              
                                _data.tanggalRowSpan = tanggalRowSpan;
                                this.data.results.push(_data);
                     
                    }
                    console.log(this.data.results);
                   
                })
        }
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

    setShift(e) {
        var _shift = (e ? (e.srcElement.value ? e.srcElement.value : e.detail) : this.shift);
        if (_shift.toLowerCase() == 'semua') {
            this.data.filter.shift = "";
        } else {
            this.data.filter.shift = parseInt(_shift);
        }
    }

}
