module.exports = [
    {
        route: 'sales',
        name: 'sales',
        moduleId: './modules/sales-cr/index',
        nav: true,
        title: 'Penjualan',
        auth: true,
        settings: {
            group: "transaction",
            permission: { "SLO.01" : 1, "SLO.02" : 1, "SLO.03" : 1, "PJL1":1 }
        }
    },
    {
        route: 'salesReturn',
        name: 'salesReturn',
        moduleId: './modules/sales-return-cr/index',
        nav: true,
        title: 'Retur Penjualan',
        auth: true,
        settings: {
            group: "transaction",
            permission: { "SLO.01" : 1, "SLO.02" : 1, "SLO.03" : 1, "PJL1":1 }
        }
    },
    {
        route: 'void-sales',
        name: 'void-sales',
        moduleId: './modules/void-sales-cr/index',
        nav: true,
        title: 'Void Penjualan',
        auth: true,
        settings: {
            group: "transaction",
            permission: { "SLO.01" : 1, "SLO.02" : 1, "SLO.03" : 1, "PJL1":1 }
        }
    }]