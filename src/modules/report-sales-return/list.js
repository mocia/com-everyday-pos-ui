import { inject, bindable, BindingEngine } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import {LocalStorage} from '../../utils/storage';
import moment from 'moment';


@inject(Router, Service, BindingEngine, LocalStorage)
export class List {
@bindable totalQtyReturn=0;
    shifts = ["Semua", "1", "2", "3", "4", "5"];

    constructor(router, service, bindingEngine, localStorage) {
        this.router = router;
        this.service = service;
        this.bindingEngine = bindingEngine;
        this.localStorage = localStorage;

        this.stores = this.localStorage.me.data.stores;
        // this.stores = session.stores;

        this.data = { filter: {}, results: [] };
        this.error = { filter: {}, results: [] };
        
        this.data.filter.dateFrom = new Date();
        this.data.filter.dateTo = new Date();
        
        this.isFilter = false;
        this.reportHTML = ""

        this.totalQty = 0; 
        this.totalOmsetBruto = 0;
        this.totalOmsetNetto = 0;
        this.targetPerMonth = 0;
        this.sisaTargetNominal = 0;
        this.sisaTargetPercentage = 0;
    }

    activate() {
    }

    attached() {
        this.data.filter.shift = 0;
        this.data.filter.storeId = this.localStorage.store.code;
        this.data.filter.store = this.localStorage.store;
        // this.data.filter.storeId = this.session.store._id;
        // this.data.filter.store =  this.session.store;
        this.getTargetPerMonth();
                    
        this.bindingEngine.propertyObserver(this.data.filter, "storeId").subscribe((newValue, oldValue) => {
            this.getTargetPerMonth();
        });
    }
    
    getTargetPerMonth() {
        this.targetPerMonth = 0;
            if (this.data.filter.store)
                if (this.data.filter.store.salesTarget)
                    this.targetPerMonth = this.data.filter.store.salesTarget;
    }
    
    filter() {
        this.totalQtyReturn=0;
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
                    getData.push(this.service.getAllSalesReturnByFilter(this.data.filter.storeId, from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'), this.data.filter.shift));
                }
                Promise.all(getData)
                .then(salesPerDays => {
                    this.data.results = [];
                    for (var data of salesPerDays) {
                        if (data.length != 0) {
                            for (var header of data){
                                console.log(header.code)
                                var totalQty = 0;
                                var totalOmsetBruto = 0;
                                var totalDiscount1Nominal = 0;
                                var totalDiscount1Netto = 0;
                                var totalDiscount2Nominal = 0;
                                var totalDiscount2Netto = 0;
                                var totalDiscountNominal = 0;
                                var totalDiscountNominalNetto = 0;
                                var totalDiscountSpecialNominal = 0;
                                var totalDiscountSpecialNetto = 0;
                                var totalDiscountMarginNominal = 0;
                                var totalDiscountMarginNetto = 0;
                                var totalTotal = 0;
                                 
                                var totalOmsetBrutoReturn = 0;
                                var totalDiscount1NominalReturn = 0;
                                var totalDiscount1NettoReturn = 0;
                                var totalDiscount2NominalReturn = 0;
                                var totalDiscount2NettoReturn = 0;
                                var totalDiscountNominalReturn = 0;
                                var totalDiscountNominalNettoReturn = 0;
                                var totalDiscountSpecialNominalReturn = 0;
                                var totalDiscountSpecialNettoReturn = 0;
                                var totalDiscountMarginNominalReturn = 0;
                                var totalDiscountMarginNettoReturn = 0;
                                var totalTotalReturn = 0;
                                
                                var totalKelebihanBayar = 0;
                                var totalSubTotal = 0;
                                var totalDiscountSaleNominal = 0;
                                var totalGrandTotal = 0;

                                var tanggalRowSpan = 0;
                                var itemRowSpan = 0;
                                var subtotal = 0;
                                var subtotalReturn = 0;
                                var result = {};
                                result.tanggal = new Date(header.date);
                                result.nomorPembayaran = header.code;
                                result.items = [];
                                for (var item of header.items) {
                                    var product = {};
                                        product.isReturn = item.isReturn ? "R" : "";
                                        product.barcode = item.item.code;
                                        product.namaProduk = item.item.name;
                                        product.size = item.item.Size;
                                        product.harga = item.price;
                                        product.quantity = item.quantity;
                                        product.omsetBrutto = parseInt(product.harga) * parseInt(product.quantity);
                                        product.discount1Percentage = item.discount1;
                                        product.discount1Nominal = parseInt(product.omsetBrutto) * parseInt(product.discount1Percentage) / 100;
                                        product.discount1Netto = parseInt(product.omsetBrutto) - parseInt(product.discount1Nominal);
                                        product.discount2Percentage = item.discount2;
                                        product.discount2Nominal = parseInt(product.discount1Netto) * parseInt(product.discount2Percentage) / 100;
                                        product.discount2Netto = parseInt(product.discount1Netto) - parseInt(product.discount2Nominal);
                                        product.discountNominal = item.discountNominal;
                                        product.discountNominalNetto = parseInt(product.discount2Netto) - parseInt(product.discountNominal);
                                        product.discountSpecialPercentage = item.specialDiscount;
                                        product.discountSpecialNominal = parseInt(product.discountNominalNetto) * parseInt(product.discountSpecialPercentage) / 100;
                                        product.discountSpecialNetto = parseInt(product.discountNominalNetto) - parseInt(product.discountSpecialNominal);
                                        product.discountMarginPercentage = item.margin;
                                        product.discountMarginNominal = parseInt(product.discountSpecialNetto) * parseInt(product.discountMarginPercentage) / 100;
                                        product.discountMarginNetto = parseInt(product.discountSpecialNetto) - parseInt(product.discountMarginNominal);
                                        product.total = parseInt(product.discountMarginNetto); 
                                        console.log(product)
                                        result.items.push(product);
                                        
                                        if(item.isReturn) {
                                            subtotalReturn = parseInt(subtotalReturn) + parseInt(product.total);
                                            this.totalQtyReturn += parseInt(product.quantity);
                                            totalOmsetBrutoReturn += parseInt(product.omsetBrutto);
                                            totalDiscount1NominalReturn += parseInt(product.discount1Nominal);
                                            totalDiscount1NettoReturn += parseInt(product.discount1Netto);
                                            totalDiscount2NominalReturn += parseInt(product.discount2Nominal);
                                            totalDiscount2NettoReturn += parseInt(product.discount2Netto);
                                            totalDiscountNominalReturn += parseInt(product.discountNominal);
                                            totalDiscountNominalNettoReturn += parseInt(product.discountNominalNetto);
                                            totalDiscountSpecialNominalReturn += parseInt(product.discountSpecialNominal);
                                            totalDiscountSpecialNettoReturn += parseInt(product.discountSpecialNetto);
                                            totalDiscountMarginNominalReturn += parseInt(product.discountMarginNominal);
                                            totalDiscountMarginNettoReturn += parseInt(product.discountMarginNetto);
                                            totalTotalReturn += parseInt(product.total);
                                        }
                                        else {
                                            subtotal = parseInt(subtotal) + parseInt(product.total);
                                            totalQty += parseInt(product.quantity);
                                            totalOmsetBruto += parseInt(product.omsetBrutto);
                                            totalDiscount1Nominal += parseInt(product.discount1Nominal);
                                            totalDiscount1Netto += parseInt(product.discount1Netto);
                                            totalDiscount2Nominal += parseInt(product.discount2Nominal);
                                            totalDiscount2Netto += parseInt(product.discount2Netto);
                                            totalDiscountNominal += parseInt(product.discountNominal);
                                            totalDiscountNominalNetto += parseInt(product.discountNominalNetto);
                                            totalDiscountSpecialNominal += parseInt(product.discountSpecialNominal);
                                            totalDiscountSpecialNetto += parseInt(product.discountSpecialNetto);
                                            totalDiscountMarginNominal += parseInt(product.discountMarginNominal);
                                            totalDiscountMarginNetto += parseInt(product.discountMarginNetto);
                                            totalTotal += parseInt(product.total); 
                                        } 
                                        tanggalRowSpan += 1;
                                        itemRowSpan += 1;
                                }
                                result.subTotal = parseInt(subtotal);
                                result.subTotalReturn = parseInt(subtotalReturn);
                                result.kelebihanBayar = parseInt(result.subTotalReturn) - parseInt(result.subTotal);
                                result.discountSalePercentage = header.discount;
                                result.discountSaleNominal = parseInt(result.subTotal) * parseInt(result.discountSalePercentage) / 100;
                                result.grandTotal =  parseInt(result.subTotal) - parseInt(result.subTotalReturn) - parseInt(result.discountSaleNominal);
                                result.tipePembayaran = header.salesDetail.paymentType;
                                result.card = header.salesDetail.cardType.name ? header.salesDetail.cardType.name : "";
                                result.itemRowSpan = itemRowSpan;
                                result.kelebihanBayar = (result.kelebihanBayar < 0) ? 0 : result.kelebihanBayar;
                                result.grandTotal = (result.grandTotal < 0) ? 0 : result.grandTotal;
                                  
                                totalKelebihanBayar += parseInt(result.kelebihanBayar);
                                totalSubTotal += parseInt(result.subTotal);
                                totalDiscountSaleNominal += parseInt(result.discountSaleNominal);
                                totalGrandTotal += parseInt(result.grandTotal);
                                    
                                result.totalQty = totalQty;
                                result.totalQtyReturn = this.totalQtyReturn;
                                result.totalOmsetBruto = totalOmsetBruto - totalOmsetBrutoReturn;
                                result.totalDiscount1Nominal = totalDiscount1Nominal;
                                result.totalDiscount1Netto = totalDiscount1Netto;
                                result.totalDiscount2Nominal = totalDiscount2Nominal;
                                result.totalDiscount2Netto = totalDiscount2Netto;
                                result.totalDiscountNominal = totalDiscountNominal;
                                result.totalDiscountNominalNetto = totalDiscountNominalNetto;
                                result.totalDiscountSpecialNominal = totalDiscountSpecialNominal;
                                result.totalDiscountSpecialNetto = totalDiscountSpecialNetto;
                                result.totalDiscountMarginNominal = totalDiscountMarginNominal;
                                result.totalDiscountMarginNetto = totalDiscountMarginNetto;
                                result.totalTotal = totalTotal;
                                result.totalSubTotal = totalSubTotal;
                                result.totalKelebihanBayar = totalKelebihanBayar;
                                result.totalDiscountSaleNominal = totalDiscountSaleNominal;
                                result.totalGrandTotal = totalGrandTotal;
                                
                                result.totalOmsetBruto = (result.totalOmsetBruto < 0) ? 0 : result.totalOmsetBruto;
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
        if (_shift.toLowerCase() == 'semua'){
            this.data.filter.shift = "";
        }else{
            this.data.filter.shift = parseInt(_shift);
        }
    }

    generateReportHTML() {
        this.totalQty = 0;
        this.totalOmsetBruto = 0;
        this.totalOmsetNetto = 0;

        //console.log(JSON.stringify(this.data.results));
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.reportHTML = "";
        this.reportHTML += "    <table class='table table-bordered'>";
        this.reportHTML += "        <thead>";
        this.reportHTML += "            <tr style='background-color:#282828; color:#ffffff;'>";
        this.reportHTML += "                <th>Tanggal</th>";
        this.reportHTML += "                <th>No Pembayaran</th>";
        this.reportHTML += "                <th></th>";
        this.reportHTML += "                <th>Barcode</th>";
        this.reportHTML += "                <th>Nama Produk</th>";
        this.reportHTML += "                <th>Size</th>";
        this.reportHTML += "                <th>Harga</th>";
        this.reportHTML += "                <th>QTY</th>";
        this.reportHTML += "                <th>Omset Brutto</th>";
        this.reportHTML += "                <th>Disc 1 (%)</th>";
        this.reportHTML += "                <th>Disc 1 (Nominal)</th>";
        this.reportHTML += "                <th>Netto (setelah disc 1)</th>";
        this.reportHTML += "                <th>Disc 2 (%)</th>";
        this.reportHTML += "                <th>Disc 2 (Nominal)</th>";
        this.reportHTML += "                <th>Netto (setelah disc 2)</th>";
        this.reportHTML += "                <th>Diskon Nominal</th>";
        this.reportHTML += "                <th>Netto (setelah diskon nominal)</th>";
        this.reportHTML += "                <th>Special Disc (%)</th>";
        this.reportHTML += "                <th>Special Disc (Nominal)</th>";
        this.reportHTML += "                <th>Netto (setelah special disc)</th>";
        this.reportHTML += "                <th>Margin (%)</th>";
        this.reportHTML += "                <th>Margin (Nominal)</th>";
        this.reportHTML += "                <th>Netto (setelah margin)</th>";
        this.reportHTML += "                <th>Total</th>";
        this.reportHTML += "                <th>Subtotal (Barang Baru)</th>";
        this.reportHTML += "                <th>Kelebihan Bayar</th>";
        // this.reportHTML += "                <th>Disc Penjualan (%)</th>";
        // this.reportHTML += "                <th>Disc Penjualan (Nominal)</th>";
        this.reportHTML += "                <th>Omset on Hand</th>";
        this.reportHTML += "                <th>Tipe Pembayaran</th>";
        this.reportHTML += "                <th>Kartu</th>";
        this.reportHTML += "            </tr>";
        this.reportHTML += "        </thead>";
        this.reportHTML += "        <tbody>";
        for (var data of this.data.results) {
            var isTanggalRowSpan = false;
            var isItemRowSpan = false;
            for (var item of data.items) {
                    this.reportHTML += "        <tr>";
                    if (!isTanggalRowSpan)
                        this.reportHTML += "        <td width='300px' rowspan='" + data.tanggalRowSpan + "'>" + data.tanggal.getDate() + " " + months[data.tanggal.getMonth()] + " " + data.tanggal.getFullYear() + "</td>";
                    if (!isItemRowSpan)
                        this.reportHTML += "        <td rowspan='" + data.itemRowSpan + "'>" + data.nomorPembayaran + "</td>";
                        this.reportHTML += "            <td>" + item.isReturn + "</td>";
                        this.reportHTML += "            <td>" + item.barcode + "</td>";
                        this.reportHTML += "            <td>" + item.namaProduk + "</td>";
                        this.reportHTML += "            <td>" + item.size + "</td>";
                        this.reportHTML += "            <td>" + item.harga.toLocaleString() + "</td>";
                        this.reportHTML += "            <td>" + item.quantity.toLocaleString() + "</td>";
                        this.reportHTML += "            <td>" + item.omsetBrutto.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#48cbe2;'>" + item.discount1Percentage + "%</td>";
                        this.reportHTML += "            <td style='background-color:#48cbe2;'>" + item.discount1Nominal.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#48cbe2;'>" + item.discount1Netto.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#48e2b2;'>" + item.discount2Percentage + "%</td>";
                        this.reportHTML += "            <td style='background-color:#48e2b2;'>" + item.discount2Nominal.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#48e2b2;'>" + item.discount2Netto.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#48e24b;'>" + item.discountNominal.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#48e24b;'>" + item.discountNominalNetto.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#d6e248;'>" + item.discountSpecialPercentage + "%</td>";
                        this.reportHTML += "            <td style='background-color:#d6e248;'>" + item.discountSpecialNominal.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#d6e248;'>" + item.discountSpecialNetto.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#e28848;'>" + item.discountMarginPercentage + "%</td>";
                        this.reportHTML += "            <td style='background-color:#e28848;'>" + item.discountMarginNominal.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#e28848;'>" + item.discountMarginNetto.toLocaleString() + "</td>";
                        this.reportHTML += "            <td style='background-color:#92e045;'>" + item.total.toLocaleString() + "</td>";
                    if (!isItemRowSpan) {
                        this.reportHTML += "        <td style='background-color:#e24871;' rowspan='" + data.itemRowSpan + "'>" + data.subTotal.toLocaleString() + "</td>";
                        this.reportHTML += "        <td rowspan='" + data.itemRowSpan + "'>" + data.kelebihanBayar.toLocaleString() + "</td>";
                        // this.reportHTML += "        <td rowspan='" + item.itemRowSpan + "'>" + item.discountSalePercentage + "%</td>";
                        // this.reportHTML += "        <td rowspan='" + item.itemRowSpan + "'>" + item.discountSaleNominal.toLocaleString() + "</td>";
                        this.reportHTML += "        <td style='background-color:#e0a545;' rowspan='" + data.itemRowSpan + "'>" + data.grandTotal.toLocaleString() + "</td>";
                        this.reportHTML += "        <td rowspan='" + data.itemRowSpan + "'>" + data.tipePembayaran + "</td>";
                        this.reportHTML += "        <td rowspan='" + data.itemRowSpan + "'>" + data.card + "</td>";
                    }
                    this.reportHTML += "        </tr>";
                    isTanggalRowSpan = true;
                    isItemRowSpan = true;
                }
            }
            this.reportHTML += "    <tr style='background-color:#282828; color:#ffffff;'>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            //this.reportHTML += "        <td>" + data.totalQty.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            //this.reportHTML += "        <td>" + data.totalOmsetBruto.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            //this.reportHTML += "        <td>" + data.totalDiscount1Nominal.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            //this.reportHTML += "        <td>" + data.totalDiscount1Netto.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            //this.reportHTML += "        <td>" + data.totalDiscount2Nominal.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            //this.reportHTML += "        <td>" + data.totalDiscount2Netto.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            //this.reportHTML += "        <td>" + data.totalDiscountNominal.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            //this.reportHTML += "        <td>" + data.totalDiscountNominalNetto.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            // this.reportHTML += "        <td>" + data.totalDiscountSpecialNominal.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            // this.reportHTML += "        <td>" + data.totalDiscountSpecialNetto.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            // this.reportHTML += "        <td>" + data.totalDiscountMarginNominal.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            // this.reportHTML += "        <td>" + data.totalDiscountMarginNetto.toLocaleString() + "</td>";
            // this.reportHTML += "        <td>" + data.totalTotal.toLocaleString() + "</td>";
            this.reportHTML += "        <td>" + data.totalSubTotal.toLocaleString() + "</td>";
            this.reportHTML += "        <td>" + data.totalKelebihanBayar.toLocaleString() + "</td>";
            // this.reportHTML += "        <td></td>";
            // this.reportHTML += "        <td>" + data.totalDiscountSaleNominal.toLocaleString() + "</td>";
            this.reportHTML += "        <td>" + data.totalGrandTotal.toLocaleString() + "</td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "        <td></td>";
            this.reportHTML += "    </tr>";
            this.totalQty += parseInt(data.totalQty);
            // this.totalQtyReturn += parseInt(data.totalQtyReturn);
            this.totalOmsetBruto += parseInt(data.totalOmsetBruto);
            this.totalOmsetNetto += parseInt(data.totalGrandTotal);
        
        this.reportHTML += "        </tbody>";
        this.reportHTML += "    </table>";

        this.sisaTargetNominal = parseInt(this.totalOmsetNetto) - parseInt(this.targetPerMonth);
        this.sisaTargetPercentage = parseInt(this.totalOmsetNetto) / parseInt(this.targetPerMonth) * 100;
    }
}
