import { Component } from '@angular/core';
import { ISelectConfig } from 'select';

@Component({
  selector: 'ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx';

  public options: string[] = ['Hello', 'Mr', 'Frodo'];

  public activeTabIndex: number = 0;

  public tabs: string[] = ['tab1', 'tab2', 'tab3'];

  public config: ISelectConfig<string> = {
    allowSearch: true,
    getOptions: (term) => Promise.resolve(this.options.filter(o => !term || o.startsWith(term))),
    searchInputDelay: 300
  }

  public onTabIndexSelect(index) {
    this.activeTabIndex = index;
  }

  public onTwoTabsClick() {
    this.tabs = ['tab1', 'tab2'];
  }

  public onThreeTabsClick() {
    this.tabs = ['tab1', 'tab2', 'tab3'];
  }
}
