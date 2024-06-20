import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

  hideDefaultView: Boolean = false;
  constructor() {
    this.setDisplay(window.innerWidth);
  }

  ngOnInit(): void {  
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {

    this.setDisplay(event.target.innerWidth);
  }

  private setDisplay(windowWidth: number) {
    this.hideDefaultView = windowWidth < 769;
  }
}
