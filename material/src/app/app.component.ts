import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NewsService } from './news.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  mArticles: Array<any>;
  mSources: Array<any>;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private newsapi: NewsService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    //load articles
    this.newsapi
      .initArticles()
      .subscribe(data => (this.mArticles = data['articles']));
    //load news sources
    this.newsapi
      .initSources()
      .subscribe(data => (this.mSources = data['sources']));
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  searchArticles(source) {
    console.log('selected source is: ' + source);
    this.newsapi
      .getArticlesByID(source)
      .subscribe(data => (this.mArticles = data['articles']));
  }
}
