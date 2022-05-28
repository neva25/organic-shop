import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  id: string | null;
  product: Product = {};
  categories$;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categories$ = this.categoryService.getAll();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.productService.get(this.id).pipe(take(1)).subscribe(product => this.product = product);
  }

  save() {
    if (this.id) this.productService.update(this.product);
    else this.productService.create(this.product);
    
    this.router.navigateByUrl('/admin/products');
  }

  delete() {
    // if (confirm('Are you sure you want to delete this product?') && this.id)
    if (this.id)
      this.productService.delete(this.id);
      this.router.navigateByUrl('/admin/products');
  }

}
