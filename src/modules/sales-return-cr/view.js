import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';


@inject(Router, Service)
export class View {
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.printStruk = "";
    }

    activate(params) {
        var id = params.id;
        this.service.getById(id)
        .then(data=>{
            this.data = data; 
            this.data.dateString = this.getStringDate(new Date(this.data.date));
            this.data.timeString = this.getStringTime(new Date(this.data.date));
            this.subTotal = parseInt(this.subTotal);
            this.grandTotal = parseInt(this.grandTotal);
            for(var item of this.data.salesDocReturn.items) {
                item.returnStatus = "Barang Baru";
                item.total = parseInt(item.total);
                if(item.isReturn)
                    item.returnStatus = "Retur"; 
            }
            // this.service.getStore2(this.data.store.Code)
            // .then(result=>{
            //     this.data.storeAddress = result.Address;
            //     this.data.storePhone = result.Phone;
            // });
            // console.log(this.data);
            this.checkPaymentType();
            //this.generatePrintStruk();
            this.generatePrintStrukTable();
        })
    } 
    
    list()
    {
        this.router.navigateToRoute('list');
    } 
    
    checkPaymentType() {
        this.isCard = false;
        this.isCash = false;   
        var paymentType = this.data.salesDocReturn.salesDetail.paymentType; 
        if(paymentType.toLowerCase() == 'cash'){  
            this.isCash = true;
        }
        else if(paymentType.toLowerCase() == 'card'){  
            this.isCard = true;
        }
        else if(paymentType.toLowerCase() == 'partial'){  
            this.isCard = true;
            this.isCash = true;
        }  
    }
    
    print() {
        window.print();
    }
    
    getStringDate(date) { 
        date = new Date(date);
        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0! 
        var yyyy = date.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        //date = yyyy+'-'+mm+'-'+dd;
        date = dd+'/'+mm+'/'+yyyy;
        return date; 
    }
    
    getStringTime(date) { 
        date = new Date(date);
        var hh = date.getHours();
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        if(hh<10){
            hh='0'+hh
        } 
        if(mm<10){
            mm='0'+mm
        } 
        if(ss<10){
            ss='0'+ss
        } 
        date = hh+':'+mm+':'+ss;
        return date; 
    }
    
    generatePrintStruk() {
        // var discountSubTotal = parseInt(this.data.salesDocReturn.subTotal) * (parseInt(this.data.salesDocReturn.discount) / 100);
        // var exchange = (parseInt(this.data.salesDocReturn.salesDetail.cardAmount) + parseInt(this.data.salesDocReturn.salesDetail.cashAmount) + parseInt(this.data.salesDocReturn.salesDetail.voucher.value)) - parseInt(this.data.salesDocReturn.grandTotal);
        // var hemat = 0;
        // hemat += discountSubTotal;
        
        // this.printStruk = "";
        // // this.printStruk += "<div class='row'>";
        // // this.printStruk += "    <div class='col-xs-12'> " + this.data.salesDocReturn.salesDetail.paymentType + " </div>";
        // // this.printStruk += "</div>";
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> " + this.data.store.name + " </div>";
        // this.printStruk += "</div>";
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> " + this.data.store.address + " </div>";
        // this.printStruk += "</div>";
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> Telp: " + this.data.store.phone + " </div>";
        // this.printStruk += "</div>";
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> No. NPWP: 31.579.110.3-532.000 </div>";
        // this.printStruk += "</div>";
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> ====================================================== </div>";
        // this.printStruk += "</div>"; 
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-3'> Kasir </div>"; 
        // this.printStruk += "    <div class='col-xs-9'> " + this.data.store.code + "/" + this.data._createdBy + " </div>"; 
        // this.printStruk += "</div>";
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-3'> Nomor </div>"; 
        // this.printStruk += "    <div class='col-xs-9'> " + this.data.code + " </div>"; 
        // this.printStruk += "</div>";
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-3'> Tanggal </div>"; 
        // this.printStruk += "    <div class='col-xs-9'> " + this.data.dateString + " </div>"; 
        // this.printStruk += "</div>"; 
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> Retur ================================================ </div>";
        // this.printStruk += "</div>";  
        // for(var item of this.data.salesDocReturn.items) {
        //     if(item.isReturn) {
        //         var totalPrice = item.quantity * item.price;
        //         var discount1Nominal = totalPrice * (item.discount1 / 100);
        //         var discount2Nominal = (totalPrice - discount1Nominal) * (item.discount2 / 100);
        //         var totalDiscount12 = discount1Nominal + discount2Nominal;
        //         var discountSpecialNominal = ((totalPrice - totalDiscount12) - item.discountNominal) * (item.specialDiscount / 100)
        //         //hemat += discount1Nominal + discount2Nominal + item.discountNominal + discountSpecialNominal;
                
        //         this.printStruk += "<div>";
        //         this.printStruk += "    <div class='row'>";
        //         this.printStruk += "        <div class='col-xs-3'> " + item.item.code + " </div>"; 
        //         this.printStruk += "        <div class='col-xs-9'> " + item.item.name + " </div>"; 
        //         this.printStruk += "    </div>"; 
        //         this.printStruk += "    <div class='row'>";
        //         this.printStruk += "        <div class='col-xs-3 text-right'> " + item.quantity.toLocaleString() + " X </div>"; 
        //         this.printStruk += "        <div class='col-xs-5'> " + item.price.toLocaleString() + " </div>"; 
        //         this.printStruk += "        <div class='col-xs-4 text-right'> " + item.total.toLocaleString() + " </div>"; 
        //         this.printStruk += "    </div>"; 
        //         if(item.discount1 > 0 || item.discount2 > 0) {
        //             this.printStruk += "    <div class='row'>";
        //             this.printStruk += "        <div class='col-xs-12'> Disc. Item ";
        //             if(item.discount1 > 0) {
        //                 this.printStruk += item.discount1 + "%"; 
        //             }
        //             if(item.discount2 > 0) {
        //                 this.printStruk += " + " + item.discount2 + "%"; 
        //             }
        //             this.printStruk += " : " + totalDiscount12.toLocaleString() + " </div>"; 
        //             this.printStruk += "    </div>"; 
        //         } 
        //         if(item.discountNominal > 0) {
        //             this.printStruk += "    <div class='row'>";
        //             this.printStruk += "        <div class='col-xs-12'> Disc. Nominal " + item.discountNominal.toLocaleString() + " </div>";
        //             this.printStruk += "    </div>"; 
        //         }
        //         if(item.specialDiscount > 0) {
        //             this.printStruk += "    <div class='row'>";
        //             this.printStruk += "        <div class='col-xs-12'> Special Disc. " + item.specialDiscount + "% : " + discountSpecialNominal.toLocaleString() + " </div>";
        //             this.printStruk += "    </div>"; 
        //         }
        //         this.printStruk += "    <br/>";
        //         this.printStruk += "</div>";
        //     } 
        // }  
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> Ambil ================================================ </div>";
        // this.printStruk += "</div>";  
        // for(var item of this.data.salesDocReturn.items) {
        //     if(!item.isReturn) {
        //         var totalPrice = item.quantity * item.price;
        //         var discount1Nominal = totalPrice * (item.discount1 / 100);
        //         var discount2Nominal = (totalPrice - discount1Nominal) * (item.discount2 / 100);
        //         var totalDiscount12 = discount1Nominal + discount2Nominal;
        //         var discountSpecialNominal = ((totalPrice - totalDiscount12) - item.discountNominal) * (item.specialDiscount / 100)
        //         hemat += discount1Nominal + discount2Nominal + item.discountNominal + discountSpecialNominal;
                
        //         this.printStruk += "<div>";
        //         this.printStruk += "    <div class='row'>";
        //         this.printStruk += "        <div class='col-xs-3'> " + item.item.code + " </div>"; 
        //         this.printStruk += "        <div class='col-xs-9'> " + item.item.name + " </div>"; 
        //         this.printStruk += "    </div>"; 
        //         this.printStruk += "    <div class='row'>";
        //         this.printStruk += "        <div class='col-xs-3 text-right'> " + item.quantity.toLocaleString() + " X </div>"; 
        //         this.printStruk += "        <div class='col-xs-5'> " + item.price.toLocaleString() + " </div>"; 
        //         this.printStruk += "        <div class='col-xs-4 text-right'> " + item.total.toLocaleString() + " </div>"; 
        //         this.printStruk += "    </div>"; 
        //         if(item.discount1 > 0 || item.discount2 > 0) {
        //             this.printStruk += "    <div class='row'>";
        //             this.printStruk += "        <div class='col-xs-12'> Disc. Item ";
        //             if(item.discount1 > 0) {
        //                 this.printStruk += item.discount1 + "%"; 
        //             }
        //             if(item.discount2 > 0) {
        //                 this.printStruk += " + " + item.discount2 + "%"; 
        //             }
        //             this.printStruk += " : " + totalDiscount12.toLocaleString() + " </div>"; 
        //             this.printStruk += "    </div>"; 
        //         } 
        //         if(item.discountNominal > 0) {
        //             this.printStruk += "    <div class='row'>";
        //             this.printStruk += "        <div class='col-xs-12'> Disc. Nominal " + item.discountNominal.toLocaleString() + " </div>";
        //             this.printStruk += "    </div>"; 
        //         }
        //         if(item.specialDiscount > 0) {
        //             this.printStruk += "    <div class='row'>";
        //             this.printStruk += "        <div class='col-xs-12'> Special Disc. " + item.specialDiscount + "% : " + discountSpecialNominal.toLocaleString() + " </div>";
        //             this.printStruk += "    </div>"; 
        //         }
        //         this.printStruk += "    <br/>";
        //         this.printStruk += "</div>";
        //     }
        // } 
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> ====================================================== </div>";
        // this.printStruk += "</div>";   
        // this.printStruk += "<div>";
        // this.printStruk += "    <div class='row'>";
        // this.printStruk += "        <div class='col-xs-4'> Total Item: " + this.data.salesDocReturn.totalProduct.toLocaleString() + " </div>";
        // this.printStruk += "        <div class='col-xs-8'>";
        // this.printStruk += "            <div class='row'>";
        // this.printStruk += "                <div class='col-xs-8 text-right'> Subtotal :</div>";
        // this.printStruk += "                <div class='col-xs-4 text-right'> " + this.data.salesDocReturn.subTotal.toLocaleString() + " </div>";
        // this.printStruk += "            </div>";
        // this.printStruk += "            <div class='row'>";
        // this.printStruk += "                <div class='col-xs-8 text-right'> Disc :</div>";
        // this.printStruk += "                <div class='col-xs-4 text-right'> " + discountSubTotal.toLocaleString() + " </div>";
        // this.printStruk += "            </div>";
        // this.printStruk += "            <div class='row'>";
        // this.printStruk += "                <div class='col-xs-8 text-right'> Grand Total :</div>";
        // this.printStruk += "                <div class='col-xs-4 text-right'> " + this.data.salesDocReturn.grandTotal.toLocaleString() + " </div>";
        // this.printStruk += "            </div>";
        // if(this.isCash) {
        //     this.printStruk += "            <div class='row'>";
        //     this.printStruk += "                <div class='col-xs-8 text-right'> Tunai :</div>";
        //     this.printStruk += "                <div class='col-xs-4 text-right'> " + this.data.salesDocReturn.salesDetail.cashAmount.toLocaleString() + " </div>";
        //     this.printStruk += "            </div>";
        // }
        // if(this.isCard) { 
        //     this.printStruk += "            <div class='row'>";
        //     this.printStruk += "                <div class='col-xs-8 text-right'> " + this.data.salesDocReturn.salesDetail.card + " Card :</div>";
        //     this.printStruk += "                <div class='col-xs-4 text-right'> " + this.data.salesDocReturn.salesDetail.cardAmount.toLocaleString() + " </div>";
        //     this.printStruk += "            </div>";
        // }
        // if(this.data.salesDocReturn.salesDetail.voucher.value > 0) {
        //     this.printStruk += "            <div class='row'>";
        //     this.printStruk += "                <div class='col-xs-8 text-right'> Voucher :</div>";
        //     this.printStruk += "                <div class='col-xs-4 text-right'> " + this.data.salesDocReturn.salesDetail.voucher.value.toLocaleString() + " </div>";
        //     this.printStruk += "            </div>";
        // }
        // if(this.isCash) {
        //     this.printStruk += "            <div class='row'>";
        //     this.printStruk += "                <div class='col-xs-8 text-right'> Kembali :</div>";
        //     this.printStruk += "                <div class='col-xs-4 text-right'> " + exchange.toLocaleString() + " </div>";
        //     this.printStruk += "            </div>";
        // }
        // this.printStruk += "        </div>";
        // this.printStruk += "    </div>"; 
        // this.printStruk += "</div>"; 
        // if(this.isCard) {
        //     this.printStruk += "<div class='row'>";
        //     this.printStruk += "    <div class='col-xs-12'> Bank: " + this.data.salesDocReturn.salesDetail.bank.name + " - " + this.data.salesDocReturn.salesDetail.cardNumber + " </div>";
        //     this.printStruk += "</div>";  
        // }
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> Hemat: " + hemat.toLocaleString() + " </div>";
        // this.printStruk += "</div>";  
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> ====================================================== </div>";
        // this.printStruk += "</div>";   
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12' style='font-size:6pt;'> <center>BARANG YANG DITUKAR, TIDAK BISA DITUKAR KEMBALI</center> </div>";
        // this.printStruk += "</div>";   
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> ====================================================== </div>";
        // this.printStruk += "</div>";  
        // this.printStruk += "<div class='row'>";
        // this.printStruk += "    <div class='col-xs-12'> <center>TERIMA KASIH ATAS KUNJUNGAN ANDA</center> </div>";
        // this.printStruk += "</div>";
    }
    
    generatePrintStrukTable() { 
        var discountSubTotal = parseInt(this.data.salesDocReturn.subTotal) * (parseInt(this.data.salesDocReturn.discount) / 100);
        var exchange = (parseInt(this.data.salesDocReturn.salesDetail.cardAmount) + parseInt(this.data.salesDocReturn.salesDetail.cashAmount) + parseInt(this.data.salesDocReturn.salesDetail.voucher.value)) - parseInt(this.data.salesDocReturn.grandTotal);
        var hemat = 0;
        hemat += discountSubTotal;
        
        this.printStruk = ""; 
        this.printStruk += "<table style='width:100%;'>";
        // this.printStruk += "    <tr>";
        // this.printStruk += "        <td colspan='3'> this.data.salesDocReturn.salesDetail.paymentType </td>";
        // this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> " + this.data.store.Name + " </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> " + this.data.store.Address + " </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> " + this.data.store.Phone + " </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> No. NPWP: 31.579.110.3-532.000 </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> =============================== </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'>";
        this.printStruk += "            Kasir : " + this.data.store.Code + "/" + this.data._CreatedBy;
        // this.printStruk += "            <div class='col-xs-3'> Kasir </div>"; 
        // this.printStruk += "            <div class='col-xs-9'> " + this.data.store.code + "/" + this.data._createdBy + " </div>"; 
        this.printStruk += "        </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'>";
        this.printStruk += "            Nomor : " + this.data.code;
        // this.printStruk += "            <div class='col-xs-3'> Nomor </div>"; 
        // this.printStruk += "            <div class='col-xs-9'> " + this.data.code + " </div>";  
        this.printStruk += "        </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'>";
        this.printStruk += "            Tanggal : " + this.data.dateString + " " + this.data.timeString;
        // this.printStruk += "            <div class='col-xs-3'> Tanggal </div>"; 
        // this.printStruk += "            <div class='col-xs-9'> " + this.data.dateString + " </div>";  
        this.printStruk += "        </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> Retur ========================== </td>";
        this.printStruk += "    </tr>";
         
        for(var item of this.data.salesDocReturn.items) {
            if(item.isReturn) {
                var totalPrice = item.quantity * item.price;
                var discount1Nominal = totalPrice * (item.discount1 / 100);
                var discount2Nominal = (totalPrice - discount1Nominal) * (item.discount2 / 100);
                var totalDiscount12 = discount1Nominal + discount2Nominal;
                var discountSpecialNominal = ((totalPrice - totalDiscount12) - item.discountNominal) * (item.specialDiscount / 100)
                //hemat += discount1Nominal + discount2Nominal + item.discountNominal + discountSpecialNominal;
                
                this.printStruk += "    <tr>";
                this.printStruk += "        <td class='text-left'> " + item.item.code + " </td>";
                this.printStruk += "        <td colspan='2' class='text-left'> " + item.item.name + " </td>";
                this.printStruk += "    </tr>";
                this.printStruk += "    <tr>";
                this.printStruk += "        <td class='text-right'> " + item.quantity.toLocaleString() + " X &nbsp; </td>";
                this.printStruk += "        <td class='text-left'> " + item.price.toLocaleString() + " </td>";
                this.printStruk += "        <td class='text-right'> " + item.total.toLocaleString() + " </td>";
                this.printStruk += "    </tr>";
                
                if(item.discount1 > 0 || item.discount2 > 0) {
                    
                    this.printStruk += "    <tr>";
                    this.printStruk += "        <td colspan='3' class='text-left'> Disc. Item ";
                    
                    if(item.discount1 > 0) {
                        this.printStruk += item.discount1 + "%"; 
                    }
                    if(item.discount2 > 0) {
                        this.printStruk += " + " + item.discount2 + "%"; 
                    }
                    this.printStruk += "        : " + Math.floor(totalDiscount12).toLocaleString() + "</td>";
                    this.printStruk += "    </tr>";
                } 
                if(item.discountNominal > 0) {
                    this.printStruk += "    <tr>";
                    this.printStruk += "        <td colspan='3' class='text-left'> Disc. Nominal " + item.discountNominal.toLocaleString() + " </td>";
                    this.printStruk += "    </tr>";
                }
                if(item.specialDiscount > 0) {
                    this.printStruk += "    <tr>";
                    this.printStruk += "        <td colspan='3' class='text-left'> Special Disc. " + item.specialDiscount + "% : " + Math.floor(discountSpecialNominal).toLocaleString() + " </td>";
                    this.printStruk += "    </tr>";
                }
            }
        } 
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> Ambil ========================== </td>";
        this.printStruk += "    </tr>";
        for(var item of this.data.salesDocReturn.items) {
            if(!item.isReturn) {
                var totalPrice = item.quantity * item.price;
                var discount1Nominal = totalPrice * (item.discount1 / 100);
                var discount2Nominal = (totalPrice - discount1Nominal) * (item.discount2 / 100);
                var totalDiscount12 = discount1Nominal + discount2Nominal;
                var discountSpecialNominal = ((totalPrice - totalDiscount12) - item.discountNominal) * (item.specialDiscount / 100)
                hemat += discount1Nominal + discount2Nominal + item.discountNominal + discountSpecialNominal;
                
                this.printStruk += "    <tr>";
                this.printStruk += "        <td class='text-left'> " + item.item.code + " </td>";
                this.printStruk += "        <td colspan='2' class='text-left'> " + item.item.name + " </td>";
                this.printStruk += "    </tr>";
                this.printStruk += "    <tr>";
                this.printStruk += "        <td class='text-right'> " + item.quantity.toLocaleString() + " X &nbsp; </td>";
                this.printStruk += "        <td class='text-left'> " + item.price.toLocaleString() + " </td>";
                this.printStruk += "        <td class='text-right'> " + item.total.toLocaleString() + " </td>";
                this.printStruk += "    </tr>";
                
                if(item.discount1 > 0 || item.discount2 > 0) {
                    
                    this.printStruk += "    <tr>";
                    this.printStruk += "        <td colspan='3' class='text-left'> Disc. Item ";
                    
                    if(item.discount1 > 0) {
                        this.printStruk += item.discount1 + "%"; 
                    }
                    if(item.discount2 > 0) {
                        this.printStruk += " + " + item.discount2 + "%"; 
                    }
                    this.printStruk += "        : " + Math.floor(totalDiscount12).toLocaleString() + "</td>";
                    this.printStruk += "    </tr>";
                } 
                if(item.discountNominal > 0) {
                    this.printStruk += "    <tr>";
                    this.printStruk += "        <td colspan='3' class='text-left'> Disc. Nominal " + item.discountNominal.toLocaleString() + " </td>";
                    this.printStruk += "    </tr>";
                }
                if(item.specialDiscount > 0) {
                    this.printStruk += "    <tr>";
                    this.printStruk += "        <td colspan='3' class='text-left'> Special Disc. " + item.specialDiscount + "% : " + Math.floor(discountSpecialNominal).toLocaleString() + " </td>";
                    this.printStruk += "    </tr>";
                }
            }
        }
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> =============================== </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td class='text-left'> Total Item : </td>";
        this.printStruk += "        <td class='text-right'> Subtotal : </td>";
        this.printStruk += "        <td class='text-right'> " + this.data.salesDocReturn.subTotal.toLocaleString() + " </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td class='text-left'> " + this.data.salesDocReturn.totalProduct.toLocaleString() + " </td>";
        this.printStruk += "        <td class='text-right'> Disc : </td>";
        this.printStruk += "        <td class='text-right'> " + Math.floor(discountSubTotal).toLocaleString() + " </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='2' class='text-right'> Grand Total : </td>";
        this.printStruk += "        <td class='text-right'> " + this.data.salesDocReturn.grandTotal.toLocaleString() + " </td>";
        this.printStruk += "    </tr>";
         
        if(this.isCash) {
            this.printStruk += "    <tr>";
            this.printStruk += "        <td colspan='2' class='text-right'> Tunai : </td>";
            this.printStruk += "        <td class='text-right'> " + this.data.salesDocReturn.salesDetail.cashAmount.toLocaleString() + " </td>";
            this.printStruk += "    </tr>";
        }
        if(this.isCard) { 
            this.printStruk += "    <tr>";
            this.printStruk += "        <td colspan='2' class='text-right'> " + this.data.salesDocReturn.salesDetail.card + " Card : </td>";
            this.printStruk += "        <td class='text-right'> " + this.data.salesDocReturn.salesDetail.cardAmount.toLocaleString() + " </td>";
            this.printStruk += "    </tr>";
        }
        if(this.data.salesDocReturn.salesDetail.voucher.value > 0) {
            this.printStruk += "    <tr>";
            this.printStruk += "        <td colspan='2' class='text-right'> Voucher : </td>";
            this.printStruk += "        <td class='text-right'> " + this.data.salesDocReturn.salesDetail.voucher.value.toLocaleString() + " </td>";
            this.printStruk += "    </tr>";
        }
        if(this.isCash) {
            this.printStruk += "    <tr>";
            this.printStruk += "        <td colspan='2' class='text-right'> Kembali : </td>";
            this.printStruk += "        <td class='text-right'> " + exchange.toLocaleString() + " </td>";
            this.printStruk += "    </tr>";
        }
        if(this.isCard) {
            var cardNumberMasking = "XXXX-XXXX-XXXX-" + this.data.salesDocReturn.salesDetail.cardNumber.substring(this.data.salesDocReturn.salesDetail.cardNumber.length - 4, this.data.salesDocReturn.salesDetail.cardNumber.length);
            this.printStruk += "    <tr>";
            this.printStruk += "        <td colspan='3' class='text-left'> Bank : " + this.data.salesDocReturn.salesDetail.bankCard.name + " </td>";
            this.printStruk += "    </tr>";
            this.printStruk += "    <tr>";
            this.printStruk += "        <td colspan='3' class='text-left'> Nomor Kartu : " + cardNumberMasking + " </td>";
            this.printStruk += "    </tr>";
        }
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> Hemat: " + Math.floor(hemat).toLocaleString() + " </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> =============================== </td>";
        this.printStruk += "    </tr>"; 
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' style='font-size:7pt;'> <center>BARANG YANG DITUKAR, TIDAK BISA DITUKAR KEMBALI</center> </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' class='text-left'> =============================== </td>";
        this.printStruk += "    </tr>";
        this.printStruk += "    <tr>";
        this.printStruk += "        <td colspan='3' style='font-size:7pt;'> <center>TERIMA KASIH ATAS KUNJUNGAN ANDA</center> </td>";
        this.printStruk += "    </tr>";   
        this.printStruk += "</table>";
    }
}
