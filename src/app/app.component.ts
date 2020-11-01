import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'exchange-rates';
  public stream$: Observable<number>;
  private subscriptions: Subscription[] = [];
  sourceUrls = [
    'https://www.cbr-xml-daily.ru',
    'https://www.cbr-xml-daily.ru/daily_utf8.xml',
    'https://www.cbr-xml-daily.ru/daily_json.js'
  ];
  currentSourceNumber = 0;

  constructor(
    private appService: AppService
  ) {
  }

  ngOnInit(): void {
    this.interrogateSources();
    this.stream$ = interval(10000);
    this.subscriptions.push(
      this.stream$.subscribe(
        () => this.interrogateSources()
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  interrogateSources(): void {
    const sub = this.appService.getData(this.sourceUrls[this.currentSourceNumber]).subscribe((result) => {
        console.log(result);
        // console.log('успех this.sourceUrls[this.currentSourceNumber]', this.sourceUrls[this.currentSourceNumber]);
        this.currentSourceNumber = 0;
        sub.unsubscribe();
      },
      (err) => {
        console.log(err);
        console.log('this.sourceUrls[this.currentSourceNumber]', this.sourceUrls[this.currentSourceNumber]);
        this.currentSourceNumber++;
        this.interrogateSources();
      });

  }

}
