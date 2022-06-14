import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';


@inject(Router, Service)
export class Create {

    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.data = { items: [], salesDetail: { cardType: {}, bank: {}, voucher: {}, promoDoc: [] } };
        this.error = { items: [] };
    }

    activate(params) {

    }

    list() {
        this.router.navigateToRoute('list');
    }

    detail(data) {
        this.router.navigateToRoute('view', { id: data });
    }

    save() {
        //remove itemId yang kosong
        for (var i = 0; i < this.data.items.length;) {
            var item = this.data.items[i];
            if (item.itemId == '') {
                var itemIndex = this.data.items.indexOf(item);
                this.data.items.splice(itemIndex, 1);
            }
            else {
                i++;
            }
        }
        if (this.data.salesDetail.cardType)
            this.data.salesDetail.cardTypeId = this.data.salesDetail.cardType._id;
        if (this.data.salesDetail.bank)
            this.data.salesDetail.bankId = this.data.salesDetail.bank._id;
        if (this.data.salesDetail.bankCard)
            this.data.salesDetail.bankCardId = this.data.salesDetail.bankCard._id;

        this.service.create(this.data)
            .then(id => {
                this.detail(id);
                //this.list();
            })
            .catch(e => {
                this.error = e;
                alert('Terjadi Kesalahan');
            })
    }
}