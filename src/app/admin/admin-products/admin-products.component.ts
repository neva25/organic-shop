import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  
  products: Product[] = [];
  dtTrigger = new Subject<any>();
  dtOptions: DataTables.Settings = {};

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.productService.getProducts(dataTablesParameters.search.value)
          .subscribe(products => {
            this.products = products;
            this.dtTrigger.next(this.products);

            callback({
              recordsTotal: products.length,
              recordsFiltered: products.length,
              data: [],
            });
          }); 
      },
      columns: [
        { data: 'title' },
        { data: 'price' },
        { data: '' }
      ],
    };
  }
}
