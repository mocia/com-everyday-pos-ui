import { Aurelia, inject, computedFrom } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { AuthStep } from './utils/auth-step';

@inject(AuthService)

export class App {
  constructor(authService) {
    this.authService = authService;
  }
  configureRouter(config, router) {
    config.title = '';
    config.addPipelineStep('authorize', AuthStep);

     var routes =[
      { route: 'login', name: 'login', moduleId: './login', nav: true, title: 'login' },
      { route: ['', 'welcome'], name: 'welcome', moduleId: './welcome', nav: false, title: 'Welcome' ,auth:true},
      { route: 'samples', name: 'samples', moduleId: './samples/index', nav: true, title: 'Samples' },
      { route: 'forbidden', name: 'forbidden', moduleId: './forbidden', nav: false, title: 'forbidden' },
      { route: 'sales', name: 'sales', moduleId: './modules/sales-cr/index', nav: true, title: 'Penjualan', auth:true,settings: { group: "transaction", roles: ["admin"] } },
      { route: 'salesReturn', name: 'salesReturn', moduleId: './modules/sales-return-cr/index', nav: true, title: 'Retur Penjualan', auth:true,settings: { group: "transaction", roles: ["admin"] } },
      { route: 'void-sales', name: 'void-sales', moduleId: './modules/void-sales-cr/index', nav: true, title: 'Void Penjualan', auth:true,settings: { group: "transaction", roles: ["admin"] } },
      { route: 'report-sales-payment', name: 'report-sales-payment', moduleId: './modules/report-sales-payment/index', nav: true, title: 'Laporan Penjualan - Omset', auth:true,settings: { group: "report", roles: ["admin"] } },
      { route: 'report-payment-method', name: 'report-payment-method', moduleId: './modules/report-payment-method/index', nav: true, title: 'Laporan Penjualan - Metode Payment', auth:true,settings: { group: "report", roles: ["admin"] } },
      { route: 'report-sales-return', name: 'report-sales-return', moduleId: './modules/report-sales-return/index', nav: true, title: 'Laporan Retur Penjualan',auth:true, settings: { group: "report", roles: ["admin"] } },
      { route: 'report-void-sales', name: 'report-void-sales', moduleId: './modules/report-void-sales/index', nav: true, title: 'Laporan Void Penjualan',auth:true, settings: { group: "report", roles: ["admin"] } }
    ];

    config.map(routes);
    this.router = router;
  }

  @computedFrom('authService.authenticated')
  get isAuthenticated() {
    return this.authService.authenticated;
  }
}
