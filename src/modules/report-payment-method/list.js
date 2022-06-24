import { inject,bindable, Lazy, BindingEngine } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AuthService } from 'aurelia-authentication';
import { Service } from './service';
import { LocalStorage } from '../../utils/storage';

import moment from 'moment';

@inject(Router, Service, BindingEngine, AuthService, LocalStorage)
export class List {

    // storeApiUri = require('../../host').master + '/stores';
    shifts = ["Semua", "1", "2", "3", "4", "5"];
    @bindable storeName="";
    @bindable storeAddress=""; 
    @bindable storePhone="";
    constructor(router, service, 
        bindingEngine, authService, localStorage) {
        this.router = router;
        this.service = service;
        this.bindingEngine = bindingEngine;
        this.authService = authService;
        this.localStorage = localStorage;

        this.data = { filter: {}, results: [] };
        this.error = { filter: {}, results: [] };

        this.data.filter.dateFrom = new Date();
        this.data.filter.dateTo = new Date();
        this.isFilter = false;
        this.reportHTML = ""

        this.totalQty = 0;
        this.totalCash = 0;
        this.totalVoucher = 0;
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


        this.data.filter.shift = 0;
        this.data.filter.storeId = this.localStorage.store.code;
        this.data.filter.store = this.localStorage.store
        this.data.filter.user = this.localStorage.me.data.username;
        this.service.getStore(this.data.filter.storeId)
            .then(result => {
                this.data.filter.store = result;
            })
            this.storeName=this.data.filter.store.name;
            this.storeAddress=this.data.filter.store.address;
            this.storePhone=this.data.filter.store.phone;
           
        this.detailData = [];
    }

    activate() {
    }



    attached() {
        // this.bindingEngine.propertyObserver(this.data.filter, "storeId").subscribe((newValue, oldValue) => {
        // });
    }

    // filter() {
    //     this.error = { filter: {}, results: [] };
    //     var datefrom = new Date(this.data.filter.dateFrom);
    //     var dateto = new Date(this.data.filter.dateTo);

    //     if (this.data.filter.storeId == undefined || this.data.filter.storeId == '')
    //         this.error.filter.storeId = "Please choose Store";
    //     else if (dateto < datefrom)
    //         this.error.filter.dateTo = "Tanggal From Harus Lebih Besar Dari To";
    //     else {
    //         var getData = [];
    //         for (var d = datefrom; d <= dateto; d.setDate(d.getDate() + 1)) {
    //             var date = new Date(d);
    //             var from = moment(d).startOf('day');
    //             var to = moment(d).endOf('day');
    //             getData.push(this.service.getAllSalesByFilter(this.data.filter.storeId, from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'), this.data.filter.shift));
    //         }
    //         Promise.all(getData)
    //             .then(salesPerDays => {
    //                 this.data.results = [];
    //                 for (var salesPerDay of salesPerDays) {
    //                     if (salesPerDay.length != 0) {
    //                         var totalSubTotal = 0;

    //                         var tanggalRowSpan = 0;
    //                         var result = {};
    //                         result.items = [];
    //                         for (var data of salesPerDay) {
    //                             var itemRowSpan = 0;
    //                             var itemData = {};
    //                             itemData.details = [];
    //                             result.tanggal = new Date(data.Date);

    //                             itemData.nomorPembayaran = data.Code;
    //                             itemData.isVoid = data.IsVoid;
    //                             itemData.voucherNominal = parseInt(data.salesDetail.VoucherValue);
    //                             if (data.CashAmount != 0 && data.CardAmount == 0)
    //                                 itemData.cashNominal = parseInt(data.GrandTotal) - parseInt(data.Voucher.Value);
    //                             else
    //                                 itemData.cashNominal = parseInt(data.CashAmount);
    //                             if (data.Card && data.Card == "Debit") {
    //                                 itemData.debitNominal = parseInt(data.CardAmount);
    //                                 itemData.creditNominal = 0;
    //                             }
    //                             else {
    //                                 itemData.debitNominal = 0;
    //                                 itemData.creditNominal = parseInt(data.CardAmount);
    //                             }

    //                             itemData.paymentType = data.PaymentType

    //                             //if (data.salesDetail.bank.name != null && data.salesDetail.bank._active != null && data.salesDetail.bank._active !== false) {
    //                             if(data.BankName != null){
    //                                 itemData.bank = data.salesDetail.bank.name;
    //                             }
    //                             else
    //                                 itemData.bank = "Kartu tidak Teridentifikasi";

    //                             //if (data.salesDetail.bankCard.name != null && data.salesDetail.bankCard._active != null && data.salesDetail.bankCard._active !== false) {
    //                             if (data.BankCardName != null ) {
    //                                 itemData.bankCard = data.salesDetail.bankCard.name;
    //                             }
    //                             else
    //                                 itemData.bankCard = "Kartu tidak Teridentifikasi";

    //                             if (data.CardTypeName == "Mastercard") {
    //                                 itemData.debitNominalLainnya = 0;
    //                                 itemData.creditMasterNominal = parseInt(data.CardAmount);
    //                                 itemData.creditVisaNominal = 0;
    //                                 itemData.creditNominalLainnya = 0;

    //                             }
    //                             else if (data.CardTypeName == "Visa") {
    //                                 itemData.debitNominalLainnya = 0;
    //                                 itemData.creditMasterNominal = 0;
    //                                 itemData.creditVisaNominal = parseInt(data.CardAmount);
    //                                 itemData.creditNominalLainnya = 0;

    //                             }
    //                             else if (data.CardTypeName != "Visa" && data.CardTypeName != "Mastercard") {
    //                                 if (data.Card == "Debit") {
    //                                     itemData.creditNominalLainnya = 0;
    //                                     itemData.debitNominalLainnya = parseInt(data.CardAmount);
    //                                     itemData.creditMasterNominal = 0;
    //                                     itemData.creditVisaNominal = 0;
    //                                 }
    //                                 else {
    //                                     itemData.creditNominalLainnya = parseInt(data.CardAmount);
    //                                     itemData.debitNominalLainnya = 0;
    //                                     itemData.creditMasterNominal = 0;
    //                                     itemData.creditVisaNominal = 0;
    //                                 }
    //                             }
    //                             itemRowSpan++;
    //                             tanggalRowSpan++;

    //                             itemData.itemRowSpan = itemRowSpan;
    //                             totalSubTotal += parseInt(itemData.subTotal);

    //                             result.items.push(itemData);
    //                         }
    //                         result.totalSubTotal = totalSubTotal;

    //                         result.tanggalRowSpan = tanggalRowSpan;
    //                         this.data.results.push(result);
    //                     }
    //                 }
    //                 this.generateReportHTML();
    //                 this.isFilter = true;
    //             })
    //     }
    // }


    filter() {
        this.error = { filter: {}, results: [] };
        var datefrom = new Date(this.data.filter.dateFrom);
        var dateto = new Date(this.data.filter.dateTo);

        if (this.data.filter.storeId == undefined || this.data.filter.storeId == '')
            this.error.filter.storeId = "Please choose Store";
        else if (dateto < datefrom)
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
                                console.log(salesPerDay);
                                var itemRowSpan = 0;
                                var itemData = {};
                                itemData.details = [];
                                result.tanggal = new Date(data.Date);

                                itemData.nomorPembayaran = data.Code;
                                itemData.isVoid = data.IsVoid;
                                itemData.voucherNominal = parseInt(data.VoucherValue);
                                if (data.CashAmount != 0 && data.CardAmount == 0)
                                    itemData.cashNominal = parseInt(data.GrandTotal) - parseInt(data.VoucherValue);
                                else
                                    itemData.cashNominal = parseInt(data.CashAmount);
                                if (data.Card && data.Card == "Debit") {
                                    itemData.debitNominal = parseInt(data.CardAmount);
                                    itemData.creditNominal = 0;
                                }
                                else {
                                    itemData.debitNominal = 0;
                                    itemData.creditNominal = parseInt(data.CardAmount);
                                }

                                itemData.paymentType = data.PaymentType

                                //if (data.salesDetail.BankName != null && data.salesDetail.bank._active != null && data.salesDetail.bank._active !== false) {
                                if (data.BankName != null) {    
                                    itemData.bank = data.BankName;
                                }
                                else
                                    itemData.bank = "Kartu tidak Teridentifikasi";

                               // if (data.BankCardName != null && data.salesDetail.bankCard._active != null && data.salesDetail.bankCard._active !== false) {
                                if (data.BankCard != null ) {
                                    itemData.bankCard = data.BankCard;
                                }
                                else
                                    itemData.bankCard = "Kartu tidak Teridentifikasi";

                                if (data.CardTypeName == "Mastercard") {
                                    itemData.debitNominalLainnya = 0;
                                    itemData.creditMasterNominal = parseInt(data.CardAmount);
                                    itemData.creditVisaNominal = 0;
                                    itemData.creditNominalLainnya = 0;

                                }
                                else if (data.CardTypeName == "Visa") {
                                    itemData.debitNominalLainnya = 0;
                                    itemData.creditMasterNominal = 0;
                                    itemData.creditVisaNominal = parseInt(data.CardAmount);
                                    itemData.creditNominalLainnya = 0;

                                }
                                else if (data.CardTypeName != "Visa" && data.CardTypeName != "Mastercard") {
                                    if (data.Card == "Debit") {
                                        itemData.creditNominalLainnya = 0;
                                        itemData.debitNominalLainnya = parseInt(data.CardAmount);
                                        itemData.creditMasterNominal = 0;
                                        itemData.creditVisaNominal = 0;
                                    }
                                    else {
                                        itemData.creditNominalLainnya = parseInt(data.CardAmount);
                                        itemData.debitNominalLainnya = 0;
                                        itemData.creditMasterNominal = 0;
                                        itemData.creditVisaNominal = 0;
                                    }
                                }
                                itemRowSpan++;
                                tanggalRowSpan++;

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

        this.reportHTML = "Payment Summary";
        this.reportHTML += "    <table class='table table-bordered'>";
        this.reportHTML += "        <thead>";
        this.reportHTML += "            <tr style='background-color:#282828; color:#ffffff;'>";
        this.reportHTML += "                <th>Tanggal</th>";
        this.reportHTML += "                <th>Total Transaksi</th>";
        this.reportHTML += "                <th>Cash (nominal)</th>";
        this.reportHTML += "                <th>Debit Card (nominal)</th>";
        this.reportHTML += "                <th>Credit Card (nominal)</th>";
        this.reportHTML += "                <th>Voucher (nominal)</th>";
        this.reportHTML += "                <th>Total Omset (in hand)</th>";
        this.reportHTML += "            </tr>";
        this.reportHTML += "        </thead>";
        this.reportHTML += "        <tbody>";

        var totalTotalTransaksi = 0;

        for (var data of this.data.results) {
            var isTanggalRowSpan = false;
            var tempCash = 0;
            var tempDebit = 0;
            var tempCredit = 0;
            var tempVoucher = 0;
            var totalTransaksi = 0;
            for (var item of data.items) {
                if (!item.isVoid) {
                    totalTransaksi++;
                    tempCash += item.cashNominal;
                    tempDebit += item.debitNominal;
                    tempCredit += item.creditNominal;
                    tempVoucher += item.voucherNominal;
                }
            }
            for (var item of data.items) {
                if (!item.isVoid) {
                    totalTotalTransaksi++;
                    var isItemRowSpan = false;
                    var totalOmset = tempCash + tempCredit + tempDebit + tempVoucher;
                    this.reportHTML += "        <tr>";
                    if (!isTanggalRowSpan) {
                        this.reportHTML += "        <td width='300px'>" + data.tanggal.getDate() + " " + months[data.tanggal.getMonth()] + " " + data.tanggal.getFullYear() + "</td>";
                        this.reportHTML += "        <td>" + parseInt(totalTransaksi).toLocaleString() + "</td>";
                        this.reportHTML += "        <td>" + parseInt(tempCash).toLocaleString() + "</td>";
                        this.reportHTML += "        <td>" + parseInt(tempDebit).toLocaleString() + "</td>";
                        this.reportHTML += "        <td>" + parseInt(tempCredit).toLocaleString() + "</td>";
                        this.reportHTML += "        <td>" + parseInt(tempVoucher).toLocaleString() + "</td>";
                        this.reportHTML += "        <td>" + parseInt(totalOmset).toLocaleString() + "</td>";
                    }
                    this.reportHTML += "        </tr>";
                    isTanggalRowSpan = true;
                }
                isItemRowSpan = true;
                this.reportHTML += "<tr></tr>";
            }
            this.reportHTML += "<tr></tr>";
        }
        this.reportHTML += "        <td>Total</td>";
        var totalCash = 0;
        var totalDebit = 0;
        var totalCredit = 0;
        var totalVoucher = 0;
        for (var data of this.data.results) {
            for (var item of data.items) {
                if (!item.isVoid) {
                    totalCash += item.cashNominal;
                    totalDebit += item.debitNominal;
                    totalCredit += item.creditNominal;
                    totalVoucher += item.voucherNominal;
                }
            }
        }
        this.totalCash = totalCash;
        this.totalVoucher = totalVoucher;
        var totalTotalOmset = totalCash + totalCredit + totalDebit + totalVoucher;
        this.reportHTML += "        <td style='background-color:#48cbe2;'>" + totalTotalTransaksi.toLocaleString() + "</td>";
        this.reportHTML += "        <td style='background-color:#48cbe2;'>" + totalCash.toLocaleString() + "</td>";
        this.reportHTML += "        <td style='background-color:#48cbe2;'>" + totalDebit.toLocaleString() + "</td>";
        this.reportHTML += "        <td style='background-color:#48cbe2;'>" + totalCredit.toLocaleString() + "</td>";
        this.reportHTML += "        <td style='background-color:#48cbe2;'>" + totalVoucher.toLocaleString() + "</td>";
        this.reportHTML += "        <td style='background-color:#48cbe2;'>" + totalTotalOmset.toLocaleString() + "</td>";
        this.reportHTML += "        </tbody>";
        //this.reportHTML += "    </table>";
        this.subtotalArrTotal = totalTotalOmset + this.data.filter.store.salesCapital;
        this.subtotalArrTotal = totalTotalOmset;


        var detailData = [];
        for (var data of this.data.results) {
            var tanggal = data.tanggal.getDate() + " " + months[data.tanggal.getMonth()] + " " + data.tanggal.getFullYear();
            for (var item of data.items) {
                if (!item.isVoid && item.paymentType != "Cash") {
                    var isAny = false;
                    for (var resultdata of detailData) {
                        if (resultdata.tanggal == tanggal && resultdata.bank == item.bank && resultdata.bankCard == item.bankCard) {
                            isAny = true;
                            resultdata.debitCardNominal += parseInt(item.debitNominalLainnya);
                            resultdata.creditCardNominal += parseInt(item.creditNominalLainnya);
                            resultdata.creditVisaNominal += parseInt(item.creditVisaNominal);
                            resultdata.creditMasterNominal += parseInt(item.creditMasterNominal);
                            break;
                        }
                    }
                    if (!isAny) {
                        var row = {};
                        row.tanggal = tanggal
                        row.bank = item.bank;
                        row.bankCard = item.bankCard;
                        row.debitCardNominal = parseInt(item.debitNominalLainnya);
                        row.creditCardNominal = parseInt(item.creditNominalLainnya);
                        row.creditVisaNominal = parseInt(item.creditVisaNominal);
                        row.creditMasterNominal = parseInt(item.creditMasterNominal);
                        detailData.push(row);
                    }
                }
            }
        }
        this.reportHTMLDetail = "Payment Details - Card";
        this.reportHTMLDetail += "    <table class='table table-bordered'>";
        this.reportHTMLDetail += "        <thead>";
        this.reportHTMLDetail += "            <tr style='background-color:#282828; color:#ffffff;'>";
        this.reportHTMLDetail += "                <th width='300px'>Tanggal</th>";
        this.reportHTMLDetail += "                <th>Bank (EDC)</th>";
        this.reportHTMLDetail += "                <th>Bank (Kartu)</th>";
        this.reportHTMLDetail += "                <th>Debit Card (nominal)</th>";
        this.reportHTMLDetail += "                <th>Credit Card (nominal)</th>";
        this.reportHTMLDetail += "                <th>Credit Visa (nominal)</th>";
        this.reportHTMLDetail += "                <th>Credit Master (nominal)</th>";
        this.reportHTMLDetail += "            </tr>";
        this.reportHTMLDetail += "        </thead>";
        this.reportHTMLDetail += "        <tbody>";
        for (var resultdata of detailData) {
            this.reportHTMLDetail += "<tr>";
            this.reportHTMLDetail += "  <td>" + resultdata.tanggal + "</td>";
            this.reportHTMLDetail += "  <td>" + resultdata.bank + "</td>";
            this.reportHTMLDetail += "  <td>" + resultdata.bankCard + "</td>";
            this.reportHTMLDetail += "  <td>" + resultdata.debitCardNominal.toLocaleString() + "</td>";
            this.reportHTMLDetail += "  <td>" + resultdata.creditCardNominal.toLocaleString() + "</td>";
            this.reportHTMLDetail += "  <td>" + resultdata.creditVisaNominal.toLocaleString() + "</td>";
            this.reportHTMLDetail += "  <td>" + resultdata.creditMasterNominal.toLocaleString() + "</td>";
            this.reportHTMLDetail += "</tr>";

            this.totalTempDebit += resultdata.debitCardNominal;
            this.totalTempCredit += resultdata.creditCardNominal;
            this.totalTempCreditVisa += resultdata.creditVisaNominal;
            this.totalTempCreditMaster += resultdata.creditMasterNominal;
        }
        this.reportHTMLDetail += "      <tr>";
        this.reportHTMLDetail += "          <td>Total</td>";
        this.reportHTMLDetail += "          <td></td>";
        this.reportHTMLDetail += "          <td></td>";
        this.reportHTMLDetail += "          <td style='background-color:#48cbe2;'>" + this.totalTempDebit.toLocaleString() + "</td>";
        this.reportHTMLDetail += "          <td style='background-color:#48cbe2;'>" + this.totalTempCredit.toLocaleString() + "</td>";
        this.reportHTMLDetail += "          <td style='background-color:#48cbe2;'>" + this.totalTempCreditVisa.toLocaleString() + "</td>";
        this.reportHTMLDetail += "          <td style='background-color:#48cbe2;'>" + this.totalTempCreditMaster.toLocaleString() + "</td>";
        this.reportHTMLDetail += "      </tr>";
        this.reportHTMLDetail += "   </tbody>";
        this.reportHTMLDetail += "</table>";

        this.detailData = detailData;
        //this.subtotalArrTotal = this.totalCash + this.data.filter.store.salesCapital + this.totalTempDebit + this.totalTempCredit + this.totalTempCreditVisa + this.totalTempCreditMaster;
    }
}
