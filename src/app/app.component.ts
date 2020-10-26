import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'exchange-rates';
  public stream$: Observable<number>;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.stream$ = interval(1000);
    this.subscriptions.push(
      this.stream$.subscribe(
        value => console.log(value)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

}
