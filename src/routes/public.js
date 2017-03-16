module.exports = [
    {
        route: ['', 'Welcome'],
        name: 'welcome',
        moduleId: './welcome',
        nav: false,
        title: 'Home',
        auth: true,
        settings: { roles: ["*"] }
    },
    {
        route: 'login',
        name: 'login',
        moduleId: './login',
        nav: true,
        title: 'login'
    },
    {
        route: 'samples',
        name: 'samples',
        moduleId: './samples/index',
        nav: false,
        title: 'samples'
    },
    {
        route: 'forbidden',
        name: 'forbidden',
        moduleId: './forbidden',
        nav: false,
        title: 'forbidden'
    }]