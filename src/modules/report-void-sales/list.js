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
        this.data.filter.storeCode = this.localStorage.store.code;
        // this.data.filter.storeId = this.session.store._id;
        // this.data.filter.store = this.session.store;
        // this.bindingEngine.propertyObserver(this.data.filter, "storeId").subscribe((newValue, oldValue) => { 
        // }); 
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
            var getData = [];
            // for (var d = datefrom; d <= dateto; d.setDate(d.getDate() + 1)) {
                // var date = new Date(d);
                // var from = moment(d).startOf('day');
                // var to = moment(d).endOf('day');

                let args = {
                    dateFrom : datefrom.format('YYYY-MM-DD'),
                    dateTo: dateto.format('YYYY-MM-DD'),
                    storeCode: storeCode,
                    shift: shift 
                }
                
                getData.push(this.service.getAllSalesByFilter(args));
            //}
            Promise.all(getData)
                .then(salesPerDays => {
                    this.data.results = [];
                    for (var data of salesPerDays) {
                        if (data.length != 0) {
                            for(var item of data){
                                var totalSubTotal = 0;
                                var tanggalRowSpan = 0;
                                var result = {};
                                //result.items = [];
                                //for (var data of salesPerDay) {
                                var itemRowSpan = 0;
                                //var itemData = {};
                                //itemData.details = [];
                                result.tanggal = new Date(item._LastModifiedUtc);
                                result.isVoid = item.isVoid;
                                result.nomorPembayaran = item.code;
                                result.Toko = item.storeName
                                result.barcode = item.ItemCode;
                                result.itemName = item.ItemName;
                                result.itemSize = item.ItemSize;
                                result.quantity = item.Quantity;
                                //result.grandTotal = data.grandTotal;
                                result.subTotal = item.TotalPrice
                                result.shift = item.shift;
                                result._createdBy = item._CreatedBy;
                                result._updatedBy = item._LastModifiedBy;
                                result.itemRowSpan = itemRowSpan;
                                totalSubTotal += parseInt(item.subTotal);
                                //result.items.push(itemData);
                                //}
                                //result.totalSubTotal = totalSubTotal;

                                result.tanggalRowSpan = tanggalRowSpan;
                                this.data.results.push(result);
                            }   
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
            this.data.filter.shift = "";
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
        this.reportHTML += "                <th>Barcode</th>";
        this.reportHTML += "                <th>Nama Barang</th>";
        this.reportHTML += "                <th>Size</th>";
        this.reportHTML += "                <th>Kuantitas</th>";
        this.reportHTML += "                <th>Total Harga</th>";
        this.reportHTML += "                <th>Toko</th>";
        //this.reportHTML += "                <th>Grand Total</th>";
        this.reportHTML += "                <th>Kasir</th>";
        this.reportHTML += "                <th>Shift</th>";
        this.reportHTML += "                <th>Di Void oleh</th>";
        this.reportHTML += "            </tr>";
        this.reportHTML += "        </thead>";
        this.reportHTML += "        <tbody>";


        for (var data of this.data.results) {
            var isTanggalRowSpan = false;

            //for (var item of data.items) {
                var isItemRowSpan = false;
                //if (item.isVoid) {
                    this.reportHTML += "        <tr>";

                    this.reportHTML += "            <td width='300px' rowspan='" + data.tanggalRowSpan + "'>" + data.tanggal.getDate() + " " + months[data.tanggal.getMonth()] + " " + data.tanggal.getFullYear() + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + data.nomorPembayaran + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + data.barcode + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + data.itemName + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + data.itemSize + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + data.quantity + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + data.subTotal + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + data.Toko + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + data._createdBy + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + data.shift + "</td>";

                    this.reportHTML += "            <td rowspan='" + data.tanggalRowSpan + "'>" + data._updatedBy + "</td>";

                    this.reportHTML += "        </tr>";
                //}
                isTanggalRowSpan = true;
                isItemRowSpan = true;
            }
        this.reportHTML += "        </tbody>";
        this.reportHTML += "    </table>";
        }
        

    }
//}
