import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  standalone: true,
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orderId!: string;
  orderPrice!: number;
  orderDuration!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['id'];
      this.orderPrice = params['price'];
      this.orderDuration = params['duration'];
    });
  }
}
