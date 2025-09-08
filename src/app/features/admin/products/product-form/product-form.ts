import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../product.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {
  form!: FormGroup;
  editing = false;
  productId?: number;

  get imageUrls(): FormArray {
    return this.form.get('imageUrls') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      brand: [''],
      categoryId: [null, Validators.required],
      stockQuantity: [0],
      imageUrls: this.fb.array([])
    });

    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.editing = true;
      this.productService.getProduct(this.productId).subscribe((data) => {
        this.form.patchValue(data);
        data.imageUrls?.forEach(url => this.addImage(url));
      });
    }
  }

  addImage(url: string = '') {
    this.imageUrls.push(this.fb.control(url));
  }

  removeImage(index: number) {
    this.imageUrls.removeAt(index);
  }

  save() {
    if (this.form.invalid) return;

    const product: Product = this.form.value;
    if (this.editing) {
      this.productService.updateProduct(this.productId!, product).subscribe(() => this.router.navigate(['/admin/products']));
    } else {
      this.productService.createProduct(product).subscribe(() => this.router.navigate(['/admin/products']));
    }
  }
}
