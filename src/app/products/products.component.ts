import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { switchMap } from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Unsubscribe } from 'firebase/auth';
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string | null;
  items: any = {};
  unsubscribe: Unsubscribe;

  constructor(
    private productService: ProductService,
    private cartService: ShoppingCartService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.unsubscribe = this.cartService.getItems((querySnapshot: QuerySnapshot<DocumentData>) => {
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        this.items[doc.id] = doc.data();
      });
    });

    this.productService
      .getAll()
      .pipe(switchMap(products => {
        this.products = products;
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
        this.category = params.get('category');
  
        this.filteredProducts = (this.category) ? 
          this.products.filter(p => p.category === this.category) :
          this.products;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

}