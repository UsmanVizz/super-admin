import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderServiceService {
  private selectedOrder: any;

  constructor() {}

  setSelectedOrder(order: any) {
    this.selectedOrder = order;
  }

  getSelectedOrder() {
    return this.selectedOrder;
  }
}
