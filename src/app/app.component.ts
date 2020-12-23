import { Component } from '@angular/core';
import { DecimalPipe } from "@angular/common";

@Component({
  selector: 'ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DecimalPipe]
})
export class AppComponent {
}
