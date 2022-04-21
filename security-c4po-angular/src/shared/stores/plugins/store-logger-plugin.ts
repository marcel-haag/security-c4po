import {Injectable, Inject, NgModule, ModuleWithProviders, InjectionToken} from '@angular/core';
import {NgxsPlugin, NGXS_PLUGINS, getActionTypeFromInstance} from '@ngxs/store';
import {tap} from 'rxjs/operators';

export const NGXS_LOGGER_PLUGIN_OPTIONS = new InjectionToken('NGXS_LOGGER_PLUGIN_OPTIONS');

@Injectable()
export class LoggerPlugin implements NgxsPlugin {
  constructor(@Inject(NGXS_LOGGER_PLUGIN_OPTIONS) private options: any) {
  }

  handle(state, action, next): any {
    if (this.options?.developmentMode) {
      const actionName = getActionTypeFromInstance(action);
      // console.debug('@', actionName, 'started', state);
      return next(state, action)
        .pipe(tap(result => {
          // tslint:disable-next-line:no-console
          console.debug('@', actionName, ' - AFTER', result);
        }));
    } else {
      return next(state, action);
    }
  }
}

@NgModule()
export class NgxsLoggerPluginModule {
  static forRoot(config?: any): ModuleWithProviders<any> {
    return {
      ngModule: NgxsLoggerPluginModule,
      providers: [
        {
          provide: NGXS_PLUGINS,
          useClass: LoggerPlugin,
          multi: true
        },
        {
          provide: NGXS_LOGGER_PLUGIN_OPTIONS,
          useValue: config
        }
      ]
    };
  }
}
