import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { AppService } from './app.service';
import { Source } from './app.model';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'exchange-rates';
  public stream$: Observable<number>;
  private subscriptions: Subscription[] = [];
  sources: Source[] = [
    {url: 'https://www.cbr-xml-daily.ru', type: 'json'},
    {url: 'https://www.cbr-xml-daily.ru/daily_utf8.xml', type: 'xml'},
    {url: 'https://www.cbr-xml-daily.ru/daily_json.js', type: 'json'},
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
    const sub = this.appService.getData(this.sources[this.currentSourceNumber]).subscribe((data) => {
        const parser = new xml2js.Parser({strict: false, trim: true});
        parser.parseString(data, (err, result) => {
          console.log(result);
        });
        console.log(data);
        console.log('успех this.sourceUrls[this.currentSourceNumber]', this.sources[this.currentSourceNumber]);
        this.currentSourceNumber = 0;
        sub.unsubscribe();
      },
      (err) => {
        console.log(err);
        console.log('this.sourceUrls[this.currentSourceNumber]', this.sources[this.currentSourceNumber]);
        this.currentSourceNumber++;
        this.interrogateSources();
      });
  }
}
