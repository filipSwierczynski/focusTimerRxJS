import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers ?? [],
    { provide: 'ngSkipHydration', useValue: true },
  ]
}).catch(err => console.error(err))
  .catch((err) => console.error(err));
