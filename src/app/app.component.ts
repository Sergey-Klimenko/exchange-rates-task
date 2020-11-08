import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { AppService } from './app.service';
import { JsonVALCURSResponse, Source, ValuteJson, XmlVALCURSResponse } from './app.model';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public valuteCoast: string | number;
  public courseDate: string;
  public stream$: Observable<number>;
  private subscriptions: Subscription[] = [];
  private sources: Source[] = [
    {url: 'https://www.cbr-xml-daily.ru', type: 'json'},
    {url: 'https://www.cbr-xml-daily.ru/daily_json.js', type: 'json'},
    {url: 'https://www.cbr-xml-daily.ru/daily_utf8.xml', type: 'xml'},
  ];
  public valuteName = 'Евро';
  public refreshPeriod = 10000;
  private currentSourceNumber = 0;

  constructor(
    private appService: AppService
  ) {
  }

  ngOnInit(): void {
    this.interrogateSources();
    this.stream$ = interval(this.refreshPeriod);
    this.subscriptions.push(
      this.stream$.subscribe(
        () => {
          this.interrogateSources();
        }
      )
    );
  }

  parseXML(data: string): XmlVALCURSResponse {
    let parsedData: XmlVALCURSResponse = null;
    const parser = new xml2js.Parser({strict: false, trim: true});
    parser.parseString(data, (err, result) => {
      parsedData = result;
      if (err) {
        console.log('ошибка при расшифровке данных', err);
      }
    });
    return parsedData;
  }

  findCourseInXmlData(data: string): void {
    const parsedData = this.parseXML(data);
    this.courseDate = parsedData.VALCURS.$.DATE;
    const valuteItem = parsedData.VALCURS.VALUTE.find((valute) => {
      return valute.NAME[0] === this.valuteName;
    });
    this.valuteCoast = valuteItem.VALUE[0];
  }

  findCourseInJsonData(data: JsonVALCURSResponse): void {
    this.courseDate = new Date(data.Date).toLocaleDateString();
    let valuteItem: ValuteJson;
    for (const key in data.Valute) {
      if (data.Valute.hasOwnProperty(key)) {
        if ((data.Valute[key] as ValuteJson).Name === this.valuteName) {
          valuteItem = data.Valute[key];
        }
      }
    }
    this.valuteCoast = valuteItem.Value;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  interrogateSources(): void {
    const sub = this.appService.getData(this.sources[this.currentSourceNumber]).subscribe((data) => {
        if (this.sources[this.currentSourceNumber].type === 'xml') {
          this.findCourseInXmlData(data);
        } else {
          this.findCourseInJsonData(data);
        }
        this.currentSourceNumber = 0;
        sub.unsubscribe();
      },
      (err) => {
        this.currentSourceNumber++;
        this.interrogateSources();
        console.log(err);
      });
  }
}
