import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AlertService implements  OnDestroy {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;
  private subsc_router: Subscription;

  constructor(private router: Router) {
    // clear alert message on route change
    this.subsc_router = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  ngOnDestroy(){
    this.subsc_router.unsubscribe();
  }
  
  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
