import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

interface CustomFonts {
  Roboto: {
    normal?: string;
    bold?: string;
    italics?: string;
    bolditalics?: string;
  };
}
interface DocumentDefinition {
  content: any[];
  styles?: any;
}

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
})
export class GenerateReportComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  reportList() {
    this.router.navigate(['reports']);
  }
  generatePdf() {
    // Define content for the PDF
    const documentDefinition: DocumentDefinition = {
      content: [
        { text: 'Hall Management System Report', style: 'header' },
        { text: '\n' },
        {
          text: 'Trade ID: 844806902\nReport Date: 2022-07-29',
          margin: [0, 0, 0, 10],
        },
        { text: '\n' },
        { text: 'Report Type: Sales Report' },
        { text: '\n' },
        { text: 'Trader: PAULO CARVALHO' },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
        },
      },
    };

    // Register fonts
    const customFonts: CustomFonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Bold.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-BoldItalic.ttf',
      },
    };

    // Merge vfs
    const mergedVfs = { ...pdfMake.vfs, ...pdfFonts.pdfMake.vfs };
    (pdfMake as any).vfs = mergedVfs;

    // Create a PDF with custom fonts
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

    // Download the PDF
    pdfDocGenerator.download('HMS_Report.pdf');
  }

  print() {
    // Hide the header before printing
    const header = document.querySelector('.pb-4.pt-3');
    if (header) {
      header.classList.add('hide-on-print');
    }

    // Print the document
    window.print();

    // Show the header again after printing
    if (header) {
      header.classList.remove('hide-on-print');
    }
  }
}
