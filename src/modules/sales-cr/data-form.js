import { inject, bindable, BindingEngine, observable } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { LocalStorage } from '../../utils/storage';

@inject(Router, Service, BindingEngine, LocalStorage)
export class DataForm {
    @bindable data = {};
    @bindable error = {};

    finishedGoodsApiUri = 'master/finishedgoods';
    voucherApiUri = '';

    discounts = [
        0, 5, 10, 15,
        20, 25, 30, 35,
        40, 45, 50, 55,
        60, 65, 70, 75,
        80, 85, 90, 95,
        100
    ];

    cards = [{ value: 'Debit', label: 'Debit' }, { value: 'Credit', label: 'Kredit' }];


    paymentTypes = ['', 'Cash', 'Card', 'Partial'];

    constructor(router, service, bindingEngine, localStorage) {
        this.router = router;
        this.service = service;
        this.bindingEngine = bindingEngine;
        this.readOnlyTrue = true;
        this.readOnlyFalse = false;
        this.localStorage = localStorage;

        this.stores = this.localStorage.me.data.stores;
        // this.discounts.forEach(s => { s.toString = function () { return `${this.value}%` } });
        //this.stores = session.stores; 

        this.isCard = false;
        this.isCash = false;
        var getData = [];
        getData.push(this.service.getBank());
        getData.push(this.service.getCardType());
        Promise.all(getData)
            .then(results => {
                this.Banks = results[0];
                this.Banks.unshift({});
                this.Banks.forEach(s => {
                    s.toString = function () {
                        return `${this.name ? this.name : ""}`
                    }
                })
                this.CardTypes = results[1];
                this.CardTypes.forEach(s => {
                    s.toString = function () {
                        return `${this.name ? this.name : ""}`
                    }
                })
            })
    }

    onEnterProduct(e, item) {
        var itemIndex = this.data.items.indexOf(item);
        if (e.which == 13) {
            this.service.getProductByCode(item.itemCode)
                .then(results => {
                    if (results.length > 0) {
                        var resultItem = results[0];
                        if (resultItem) {
                            var isAny = false;
                            for (var dataItem of this.data.items) {
                                if (dataItem.itemId == resultItem._id) {
                                    isAny = true;
                                    dataItem.itemCode = resultItem.code;
                                    dataItem.quantity = parseInt(dataItem.quantity) + 1;
                                    break;
                                }
                            }
                            if (!isAny) {
                                item.itemCodeReadonly = true;
                                item.itemCode = resultItem.code;
                                item.item = resultItem;
                                item.itemId = resultItem._id;
                                item.quantity = parseInt(item.quantity) + 1;
                            }
                        }
                        this.error.items[itemIndex].itemCode = "";
                        this.rearrangeItem(true);
                    }
                    else {
                        item.itemCode = "";
                        this.error.items[itemIndex].itemCode = "Barcode not found";
                    }
                })
                .catch(e => {
                    //reject(e);
                    this.error.items[itemIndex].itemCode = "Barcode not found";
                })
        }
        else {
            if (!item.itemCodeReadonly)
                item.itemCode = item.itemCode + e.key;
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    }

    getShift() {
        var today = new Date();
        this.data.shift = 0;
        if (this.data.store.shifts) {
            for (var shift of this.data.store.shifts) {
                var dateFrom = new Date(this.getUTCStringDate(today) + "T" + this.getUTCStringTime(new Date(shift.dateFrom)));
                var dateTo = new Date(this.getUTCStringDate(today) + "T" + this.getUTCStringTime(new Date(shift.dateTo)));
                if (dateFrom > dateTo) {
                    dateTo.setDate(dateTo.getDate + 1);
                }
                if (dateFrom < today && today < dateTo) {
                    this.data.shift = parseInt(shift.shift);
                    break;
                }
            }
        }
    }

    attached() {
        // this.data.storeId = this.session.store._id;
        // this.data.store = this.session.store;
        this.data.storeId = this.localStorage.store._id;
        this.data.store = this.localStorage.store;
        // this.data.shift = this.getShift();
        this.service.getStore(this.data.storeId)
            .then(result => {
                this.data.store = result;
                // this.getShift();
            })


        this.data.datePicker = this.getStringDate(new Date());
        this.data.date = new Date();
        // this.data.discount = 0;
        this.data.totalProduct = 0;
        this.data.subTotal = 0;
        this.data.totalDiscount = 0;
        this.data.total = 0;
        this.data.grandTotal = 0;
        this.data.salesDetail.voucher.value = 0;
        this.data.salesDetail.cashAmount = 0;
        this.data.salesDetail.cardAmount = 0;
        this.data.salesDetail.refund = 0;
        this.bindingEngine.collectionObserver(this.data.items)
            .subscribe(splices => {
                var index = splices[0].index;
                var item = this.data.items[index];
                if (item) {
                    this.bindingEngine.propertyObserver(item, "itemId").subscribe((newValue, oldValue) => {
                        item.price = parseInt(item.item.domesticSale);
                        this.refreshPromo(index);
                    });
                    this.bindingEngine.propertyObserver(item, "quantity").subscribe((newValue, oldValue) => {
                        this.refreshPromo(index);
                    });
                }
            });
        this.bindingEngine.propertyObserver(this.data, "storeId").subscribe((newValue, oldValue) => {
            this.refreshPromo(-1);
        });
        this.bindingEngine.propertyObserver(this.data, "date").subscribe((newValue, oldValue) => {
            this.refreshPromo(-1);
        });
        this.bindingEngine.propertyObserver(this.data.salesDetail.voucher, "value").subscribe((newValue, oldValue) => {
            this.refreshCash();
        });
        this.bindingEngine.propertyObserver(this.data.salesDetail, "cardAmount").subscribe((newValue, oldValue) => {
            this.refreshDetail();
        });
        this.bindingEngine.propertyObserver(this.data.salesDetail, "cashAmount").subscribe((newValue, oldValue) => {
            this.refreshDetail();
        });

    }

    search() {
        var reference = this.data.reference
        this.service.getSalesVoidsByCode(this.data.storeId, this.data.reference)
            .then(salesVoidsResult => {
                var salesVoids = salesVoidsResult[0]
                if (salesVoids) {
                    if (salesVoids.isVoid == true) {
                        //this.data.store = salesVoids.store;
                        //this.data.storeId = salesVoids.storeId;
                        this.data.datePicker = this.getStringDate(new Date(salesVoids.date));
                        this.data.date = new Date(salesVoids.date);
                        this.data.reference = salesVoids.code;
                        this.data.remark = salesVoids.remark;
                        for (var salesVoidsItem of salesVoids.items) {
                            var item = {};
                            item.itemCode = salesVoidsItem.item.code;
                            item.itemId = salesVoidsItem.itemId;
                            item.item = salesVoidsItem.item;
                            item.quantity = salesVoidsItem.quantity;
                            item.price = parseInt(salesVoidsItem.price);
                            item.discount1 = parseInt(salesVoidsItem.discount1);
                            item.discount2 = parseInt(salesVoidsItem.discount2);
                            item.discountNominal = parseInt(salesVoidsItem.discountNominal);
                            item.specialDiscount = salesVoidsItem.specialDiscount + "";
                            item.margin = parseInt(salesVoidsItem.margin);
                            this.data.items.push(item);
                            this.sumRow(item);
                        }
                    }
                    else {
                        alert("Transaksi harus di void dahulu");
                    }
                }
                else
                    alert('Referensi Void tidak ditemukan');
            })
            .catch(e => {
                console.log(e);
            })
    }

    addItem() {
        var item = {};
        item.itemCode = '';
        item.itemId = '';
        item.item = {};
        item.item.domesticSale = 0;
        item.quantity = 0;
        item.price = 0;
        item.discount1 = 0;
        item.discount2 = 0;
        item.discountNominal = 0;
        item.specialDiscount = 0;
        item.margin = 0;
        item.total = 0;
        item.itemCodeFocus = true;
        item.itemCodeReadonly = false;

        var errorItem = {};
        errorItem.itemCode = '';
        this.data.items.push(item);
        this.error.items.push(errorItem);
        this.sumRow(item);

    }

    removeItem(item) {
        var itemIndex = this.data.items.indexOf(item);
        this.data.items.splice(itemIndex, 1);
        this.error.items.splice(itemIndex, 1);
        this.sumTotal();
        this.refreshPromo(-1);
    }

    rearrangeItem(isAdd) {
        for (var i = 0; i < this.data.items.length;) {
            var item = this.data.items[i];
            if (item.itemId == '') {
                this.removeItem(item);
            }
            else
                i++;
        }
        if (isAdd)
            this.addItem();
    }

    sumRow(item, eventSpecialDiscount, eventDiscount1, eventDiscount2, eventDiscountNominal, eventMargin) {
        console.log("sumRow");
        var itemIndex = this.data.items.indexOf(item);
        var itemDetail = this.data.items[itemIndex];
        var specialDiscount = eventSpecialDiscount ? (eventSpecialDiscount.srcElement.value ? parseInt(eventSpecialDiscount.srcElement.value) : parseInt(eventSpecialDiscount.detail)) : parseInt(itemDetail.specialDiscount);
        var discount1 = eventDiscount1 ? (eventDiscount1.srcElement.value ? parseInt(eventDiscount1.srcElement.value) : parseInt(eventDiscount1.detail)) : parseInt(itemDetail.discount1);
        var discount2 = eventDiscount2 ? (eventDiscount2.srcElement.value ? parseInt(eventDiscount2.srcElement.value) : parseInt(eventDiscount2.detail)) : parseInt(itemDetail.discount2);
        var discountNominal = eventDiscountNominal ? (eventDiscountNominal.srcElement.value ? parseInt(eventDiscountNominal.srcElement.value) : parseInt(eventDiscountNominal.detail)) : parseInt(itemDetail.discountNominal);
        var margin = eventMargin ? (eventMargin.srcElement.value ? parseInt(eventMargin.srcElement.value) : parseInt(eventMargin.detail)) : parseInt(itemDetail.margin);
        
        itemDetail.total = 0;
        if (parseInt(itemDetail.quantity) > 0) {
            //Price
            itemDetail.total = parseInt(itemDetail.quantity) * parseInt(itemDetail.price);
            //Diskon
            itemDetail.total = (itemDetail.total * (1 - (discount1 / 100)) * (1 - (discount2 / 100))) - discountNominal;
            //Spesial Diskon 
            itemDetail.total = itemDetail.total * (1 - (specialDiscount / 100));
            //Margin
            itemDetail.total = itemDetail.total * (1 - (margin / 100));
        }
        this.sumTotal();
    }

    sumTotal(event) {
        console.log("sumTotal");
        var discount = event ? (event.srcElement.value ? parseInt(event.srcElement.value) : parseInt(event.detail)) : parseInt(this.data.discount);
        // var discount = event ? parseInt(event.srcElement.value) : parseInt(this.data.discount);
        this.data.totalProduct = 0;
        this.data.subTotal = 0;
        this.data.totalDiscount = 0;
        this.data.total = 0;
        for (var item of this.data.items) {
            this.data.subTotal = parseInt(this.data.subTotal) + parseInt(item.total);
            this.data.totalProduct = parseInt(this.data.totalProduct) + parseInt(item.quantity);
        }
        this.data.totalDiscount = parseInt(this.data.subTotal) * discount / 100;
        this.data.total = parseInt(this.data.subTotal) - parseInt(this.data.totalDiscount);
        this.data.sisaBayar = parseInt(this.data.total);
        this.data.grandTotal = parseInt(this.data.total);
        this.data.totalBayar = parseInt(this.data.grandTotal);
        this.refreshCash();
    }

    refreshCash() {
        console.log("refreshCash");
        this.data.salesDetail.cashAmount = 0;
        this.refreshDetail();
    }

    refreshDetail() {
        console.log("refreshDetail");
        this.data.total = parseInt(this.data.grandTotal) - parseInt(this.data.salesDetail.voucher.value);
        if (this.data.total < 0)
            this.data.total = 0;
        this.data.sisaBayar = this.data.total;

        if (this.isCash && this.isCard) { //partial
            this.data.salesDetail.cardAmount = parseInt(this.data.total) - parseInt(this.data.salesDetail.cashAmount);
            if (parseInt(this.data.salesDetail.cardAmount) < 0)
                this.data.salesDetail.cardAmount = 0;
        }
        else if (this.isCard) { //card 
            this.data.salesDetail.cardAmount = this.data.total;
        }
        else if (this.isCash) { //cash
            //if (parseInt(this.data.salesDetail.cashAmount) < parseInt(this.data.total)) {
            if (parseInt(this.data.salesDetail.cashAmount) <= 0) {
                this.data.salesDetail.cashAmount = this.data.total;
            }
        }

        var refund = parseInt(this.data.salesDetail.cashAmount) + parseInt(this.data.salesDetail.cardAmount) - parseInt(this.data.total);
        if (refund < 0)
            refund = 0;
        this.data.salesDetail.refund = refund;

        this.data.sisaBayar = this.data.total - this.data.salesDetail.cashAmount - this.data.salesDetail.cardAmount;
        if (this.data.sisaBayar < 0)
            this.data.sisaBayar = 0;
    }

    checkPaymentType(event) {
        console.log("checkPaymentType");

        var paymentType = event ? (event.srcElement.value ? event.srcElement.value : event.detail) : this.data.salesDetail.paymentType;
       
        this.isCard = false;
        this.isCash = false;
        if (paymentType.toLowerCase() == 'cash') {
            this.isCash = true;
        }
        else if (paymentType.toLowerCase() == 'card') {
            this.isCard = true;
        }
        else if (paymentType.toLowerCase() == 'partial') {
            this.isCard = true;
            this.isCash = true;
        }
        this.data.salesDetail.cashAmount = 0;
        this.data.salesDetail.cardAmount = 0;
        this.refreshDetail();
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

    getUTCStringDate(date) {
        var dd = date.getUTCDate();
        var mm = date.getUTCMonth() + 1; //January is 0! 
        var yyyy = date.getUTCFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        date = yyyy + '-' + mm + '-' + dd;
        return date;
    }

    getUTCStringTime(date) {
        var hh = date.getUTCHours();
        var mm = date.getUTCMinutes();
        var ss = date.getUTCSeconds();
        if (hh < 10) {
            hh = '0' + hh
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        if (ss < 10) {
            ss = '0' + ss
        }
        date = hh + ':' + mm + ':' + ss;
        return date;
    }

    setDate() {
        this.data.date = new Date(this.data.datePicker);
    }
    refreshPromo(indexItem) {
        console.log("refreshPromo");
        var getPromoes = [];
        var storeId = this.data.storeId;
        var date = this.data.date;

        for (var item of this.data.items) {
            if (indexItem == -1 || indexItem == this.data.items.indexOf(item)) {
                var itemId = item.itemId;
                var quantity = item.quantity;
                item.discount1 = 0;
                item.discount2 = 0;
                item.discountNominal = 0;
                item.price = parseInt(item.item.domesticSale);
                item.promoId = '';
                item.promo = {};
                if (storeId && itemId)
                    getPromoes.push(this.service.getPromoByStoreDatetimeItemQuantity(storeId, date, itemId, quantity));
                else
                    getPromoes.push(Promise.resolve(null));
            }
        }

        Promise.all(getPromoes)
            .then(results => {
                var resultIndex = 0;
                for (var item of this.data.items) {
                    var index = this.data.items.indexOf(item);
                    if (indexItem == -1 || indexItem == index) {
                        if (results[resultIndex]) {
                            var promo = results[resultIndex][0];
                            if (promo) {
                                item.promoId = promo._id;
                                item.promo = promo;
                                if (promo.reward.type == "discount-product") {
                                    for (var reward of promo.reward.rewards) {
                                        if (reward.unit == "percentage") {
                                            item.discount1 = parseInt(reward.discount1);
                                            item.discount2 = parseInt(reward.discount2);
                                        }
                                        else if (reward.unit == "nominal") {
                                            item.discountNominal = parseInt(reward.nominal);
                                        }
                                    }
                                }
                                if (promo.reward.type == "special-price") {
                                    //cek quantity
                                    var quantityPaket = 0;
                                    for (var item2 of this.data.items) {
                                        if (item.promoId == item2.promoId) {
                                            quantityPaket = parseInt(quantityPaket) + parseInt(item2.quantity)
                                        }
                                    }

                                    //change price
                                    for (var item2 of this.data.items) {
                                        if (item.promoId == item2.promoId) {
                                            for (var reward of promo.reward.rewards) {
                                                if (parseInt(quantityPaket) == 1)
                                                    item2.price = parseInt(reward.quantity1);
                                                else if (parseInt(quantityPaket) == 2)
                                                    item2.price = parseInt(reward.quantity2);
                                                else if (parseInt(quantityPaket) == 3)
                                                    item2.price = parseInt(reward.quantity3);
                                                else if (parseInt(quantityPaket) == 4)
                                                    item2.price = parseInt(reward.quantity4);
                                                else if (parseInt(quantityPaket) >= 5)
                                                    item2.price = parseInt(reward.quantity5);
                                            }
                                            this.sumRow(item2);
                                        }
                                    }
                                }
                            }
                        }
                        this.sumRow(item);
                        resultIndex += 1;
                    }
                }
            })
    }
}
