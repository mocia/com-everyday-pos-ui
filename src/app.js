import { Aurelia, inject, computedFrom } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { AuthStep } from './utils/auth-step';
import routes from './routes/index';

@inject(AuthService)

export class App {
  constructor(authService) {
    this.authService = authService;
  }
  configureRouter(config, router) {
    config.title = '';
    config.addPipelineStep('authorize', AuthStep);

    //  var routes =[
    //   { route: 'login', name: 'login', moduleId: './login', nav: true, title: 'login' },
    //   { route: ['', 'welcome'], name: 'welcome', moduleId: './welcome', nav: false, title: 'Welcome' ,auth:true},
    //   { route: 'samples', name: 'samples', moduleId: './samples/index', nav: true, title: 'Samples' },
    //   { route: 'forbidden', name: 'forbidden', moduleId: './forbidden', nav: false, title: 'forbidden' },
    // ];

    config.map(routes);
    this.router = router;
  }

  @computedFrom('authService.authenticated')
  get isAuthenticated() {
    return this.authService.authenticated;
  }
}
