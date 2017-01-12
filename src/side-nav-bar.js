import { inject, bindable, containerless, computedFrom } from 'aurelia-framework';
import { AuthService } from "aurelia-authentication";

@containerless()
@inject(AuthService)
export class SideNavBar {
    @bindable router = null;
    @bindable navigations = null;

    constructor(authService) {
        // this.router = router;
        this.authService = authService;
        this.minimized = false;
        this.activeMenu = [];
        this.activeSubMenu = {};
        this.group = new Map();
        this.isShown = true;
        // var a = new Array(this.router.navigation);
        // this.router.navigation.forEach(route => {
        //     console.log(1);
        // });
        // console.log(this.router.navigation instanceof Array);

    }

    @computedFrom('authService.authenticated')
    get isAuthenticated() {
        return this.authService.authenticated;
    }


    @computedFrom('activeMenu')
    get expand() {
        return (this.activeMenu || []).length > 0;
    }

    // attached() {
    //     for (var route of this.router.navigation) {
    //         if (route.settings && ((route.settings.group || "").trim().length > 0)) {
    //             var key = (route.settings.group || "").trim();
    //             if (!this.group.has(key))
    //                 this.group.set(key, []);

    //             var groupedRoutes = this.group.get(key);
    //             groupedRoutes.push(route);
    //             this.group.set(key, groupedRoutes);
    //         }
    //     }; 
    // }
    attached() {
        for (var route of this.router.navigation) {
            if (route.settings && ((route.settings.group || "").trim().length > 0)) {
                var key = (route.settings.group || "").trim();
                if (!this.group.has(key))
                    this.group.set(key, []);

                var groupedRoutes = this.group.get(key);
                groupedRoutes.push(route);
                this.group.set(key, groupedRoutes);
            }
        };
    }

    toggleSideMenu() {
        this.minimized = !this.minimized;
    }

    selectMenu(menu, title) {
        if (this.activeMenu != menu) {
            this.activeMenu = menu;
            this.activeTitle = title;
            this.activeSubMenu = [];
        }else{
            this.activeMenu = [];
            this.activeTitle = '';
            this.activeSubMenu = [];
        }
    }

    selectSubMenu(subMenu) {
        this.minimized = false;
        this.activeMenu = [];
        this.activeSubMenu = {};

        return true;
    }
}