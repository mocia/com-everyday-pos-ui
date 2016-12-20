export class Index {
  configureRouter(config, router) {
    config.map([
        {route:['', '/list'],       moduleId:'./list',          name:'list',        nav:false,      title:'Laporan Penjualan - Omset'},
    ]);

    this.router = router;
  }
}