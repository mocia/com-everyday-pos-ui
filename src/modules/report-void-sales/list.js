import { inject, Lazy, BindingEngine } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { LocalStorage } from '../../utils/storage';
import moment from 'moment';

@inject(Router, Service, BindingEngine, LocalStorage)
export class List {

    shifts = ["Semua", "1", "2", "3", "4", "5"];

    constructor(router, service, bindingEngine, localStorage) {
        this.router = router;
        this.service = service;
        this.bindingEngine = bindingEngine;
        this.localStorage = localStorage;

        this.data = { filter: {}, results: [] };
        this.error = { filter: {}, results: [] };
        this.data.filter.dateFrom = new Date();
        this.data.filter.dateTo = new Date();
        this.isFilter = false;
        this.reportHTML = ""

        this.totalQty = 0;
        this.totalCash = 0;
        this.totalTempDebit = 0;
        this.totalTempCredit = 0;
        this.totalTempCreditVisa = 0;
        this.totalTempCreditMaster = 0;
        this.unique = [];
        this.arrTotalTempDebit = [];
        this.arrTotalTempCredit = [];
        this.arrTotalTempCreditMaster = [];
        this.arrTotalTempCreditVisa = [];
        this.subtotalArrTotal = 0;
        this.totalOmsetBruto = 0;
        this.totalOmsetNetto = 0;
        this.sisaTargetNominal = 0;
        this.sisaTargetPercentage = 0;
    }

    activate() {
    }

    attached() {
        this.data.filter.shift = 0;
        this.data.filter.storeId = this.localStorage.store._id;
        this.data.filter.store = this.localStorage.store;
        // this.data.filter.storeId = this.session.store._id;
        // this.data.filter.store = this.session.store;
        // this.bindingEngine.propertyObserver(this.data.filter, "storeId").subscribe((newValue, oldValue) => { 
        // }); 
    }

    filter() {
        this.error = { filter: {}, results: [] };
        var datefrom = new Date(this.data.filter.dateFrom);
        var dateto = new Date(this.data.filter.dateTo);
        if (dateto < datefrom)
            this.error.filter.dateTo = "Tanggal From Harus Lebih Besar Dari To";
        else {
            var getData = [];
            for (var d = datefrom; d <= dateto; d.setDate(d.getDate() + 1)) {
                var date = new Date(d);
                var from = moment(d).startOf('day');
                var to = moment(d).endOf('day');
                getData.push(this.service.getAllSalesByFilter(this.data.filter.storeId, from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'), this.data.filter.shift));

            }
            Promise.all(getData)
                .then(salesPerDays => {
                    this.data.results = [];
                    for (var salesPerDay of salesPerDays) {
                        if (salesPerDay.length != 0) {
                            var totalSubTotal = 0;

                            var tanggalRowSpan = 0;
                            var result = {};
                            result.items = [];
                            for (var data of salesPerDay) {
                                var itemRowSpan = 0;
                                var itemData = {};
                                itemData.details = [];
                                result.tanggal = new Date(data._updatedDate);
                                itemData.isVoid = data.isVoid;
                                itemData.nomorPembayaran = data.code;
                                itemData.Toko = data.store.name;
                                itemData.grandTotal = data.grandTotal;
                                itemData._createdBy = data._createdBy;
                                itemData.shift = data.shift;
                                itemData._updatedBy = data._updatedBy;
                                itemData.itemRowSpan = itemRowSpan;
                                totalSubTotal += parseInt(itemData.subTotal);

                                result.items.push(itemData);
                            }
                            result.totalSubTotal = totalSubTotal;

                            result.tanggalRowSpan = tanggalRowSpan;
                            this.data.results.push(result);
                        }
                    }
                    this.generateReportHTML();
                    this.isFilter = true;
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
            this.data.filter.shift = 0;
        } else {
            this.data.filter.shift = parseInt(_shift);
        }
    }

    generateReportHTML() {
        this.totalQty = 0;

        this.totalTempDebit = 0;
        this.totalTempCredit = 0;
        this.totalTempCreditVisa = 0;
        this.totalTempCreditMaster = 0;
        this.subtotalArrTotal = 0;

        this.arrTotalTempDebit = [];
        this.arrTotalTempCredit = [];
        this.arrTotalTempCreditMaster = [];
        this.arrTotalTempCreditVisa = [];

        this.totalTempDebit = 0;
        this.totalTempCredit = 0;
        this.totalTempCreditVisa = 0;
        this.totalTempCreditMaster = 0;

        this.totalCash = 0;
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.reportHTML = "";
        this.reportHTML += "    <table class='table table-bordered'>";
        this.reportHTML += "        <thead>";
        this.reportHTML += "            <tr style='background-color:#282828; color:#ffffff;'>";
        this.reportHTML += "                <th>Tanggal</th>";
        this.reportHTML += "                <th>Nomor Transaksi</th>";
        this.reportHTML += "                <th>Toko</th>";
        this.reportHTML += "                <th>Grand Total</th>";
        this.reportHTML += "                <th>Kasir</th>";
        this.reportHTML += "                <th>Shift</th>";
        this.reportHTML += "                <th>Di Void oleh</th>";
        this.reportHTML += "            </tr>";
        this.reportHTML += "        </thead>";
        this.reportHTML += "        <tbody>";


        for (var data of this.data.results) {
            var isTanggalRowSpan = false;

            for (var item of data.items) {
                var isItemRowSpan = false;
                if (item.isVoid) {
                    this.reportHTML += "        <tr>";

                    this.reportHTML += "        <td width='300px' rowspan='" + data.tanggalRowSpan + "'>" + data.tanggal.getDate() + " " + months[data.tanggal.getMonth()] + " " + data.tanggal.getFullYear() + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + item.nomorPembayaran + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + item.Toko + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + item.grandTotal + "</td>";


                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + item._createdBy + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + item.shift + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + item._updatedBy + "</td>";

                    this.reportHTML += "        </tr>";
                }
                isTanggalRowSpan = true;
                isItemRowSpan = true;


            }
        }


    }
}
