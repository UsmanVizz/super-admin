import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import * as $ from 'jquery';
declare interface JQuery<TElement extends HTMLElement> {
  carousel(): JQuery<TElement>;
}

declare let $: any;

declare let AOS: any;

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss'],
})
export class DefaultPageComponent implements AfterViewInit, OnInit {
  slideData: any;
  constructor() {
    this.slideData = [
      {
        backdropImag: '../../../assets/images/img.jpg',
        paragraph: 'The best service with most reasonable rates in the town.',
        clientImage: '../.../../../../assets/images/Ellipse 24.png',
        clientName: 'Farzana',
        address: 'DHA VI',
      },
      {
        backdropImag: '../../../assets/images/img.jpg',
        paragraph: 'The best service with most reasonable rates in the town.',
        clientImage: '../.../../../../assets/images/Ellipse 24.png',
        clientName: 'Farzana',
        address: 'Parachinar Pakistan',
      },
      {
        backdropImag: '../../../assets/images/img.jpg',
        paragraph: 'The best service with most reasonable rates in the town.',
        clientImage: '../.../../../../assets/images/Ellipse 24.png',
        clientName: 'Farzana',
        address: 'Islamabad',
      },
    ];
  }

  ngOnInit(): void {
    AOS.init({
      offset: 200, // Change this value as needed to determine when the animation starts relative to the viewport
      duration: 600, // Animation duration in milliseconds
      easing: 'ease-in-out', // Easing function for the animation
    });
  }

  ngAfterViewInit() {
    (<any>$('#carousel-example-generic')).carousel();
  }
}
