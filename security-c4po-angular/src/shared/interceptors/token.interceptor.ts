import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../environments/environment';
import {Observable, Subscriber} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private keycloakService: KeycloakService) {
  }

  /**
   * TODO: has to be edit every time a service is added and requires the keycloak token on HEADER
   */
  private static listOfKeycloakRelevantHosts(): { origin: string }[] {
    const relevantList = new Array<{ origin: string }>();
    relevantList.push({origin: getOriginByUrl(environment.apiEndpoint)});
    relevantList.push({origin: getOriginByUrl(environment.keycloakURL)});
    return relevantList;

    function getOriginByUrl(inputUrl: string): string {
      return (new URL(inputUrl)).origin;
    }
  }

  private static requestTargetIsWhitelisted(requestTargetOrigin: string): boolean {
    if (requestTargetOrigin) {
      try {
        const targetUrl: URL = new URL(requestTargetOrigin);
        if (targetUrl && targetUrl.origin) {
          const matchList = TokenInterceptor.listOfKeycloakRelevantHosts()
            .map(value => value.origin)
            .filter(value => (value === targetUrl.origin));
          return !!matchList.length;
        }
      } catch (e) {
        // ignore e.g. local calls
      }
    }
    return false;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestTargetHost = request.url || '';

    if (TokenInterceptor.requestTargetIsWhitelisted(requestTargetHost)) {
      const tokenObserver: Observable<string> = new Observable((observer: Subscriber<any>): void => {
        this.keycloakService.getToken().then(token => {
          observer.next(token);
          observer.complete();
        }).catch(error => {
          observer.error(error);
          observer.complete();
        });
      });

      return tokenObserver.pipe(
        mergeMap((authToken: string) => {
            request = request.clone({
              headers: request.headers.append('Authorization', `Bearer ${authToken}`)
            });
            return next.handle(request);
          }
        ));
    } else {
      // Do nothing
      return next.handle(request);
    }
  }
}
