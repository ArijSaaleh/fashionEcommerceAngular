import {Component, OnInit} from '@angular/core';
import {Product, ProductService} from '../product.service';
import {Router} from '@angular/router';
import {CommonModule, CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe
  ],
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, protected router: Router) {}

  ngOnInit(): void {
    this.products = [
      {
        id: 1, name: 'T-shirt', price: 29.99,
        categoryId: 0
      },
      {
        id: 2, name: 'Dress', price: 49.99,
        categoryId: 0
      },
      {
        id: 3, name: 'Jeans', price: 39.99,
        categoryId: 0
      }
    ];
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error(err)
    });
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/products', id, 'edit']);
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }
}
