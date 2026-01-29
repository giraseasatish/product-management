import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, PaginationInfo } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  protected Math = Math;
  
  // Pagination
  pagination: PaginationInfo = {
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };
  
  // Form state
  showForm = false;
  isEditMode = false;
  currentProduct: Product = {
    product_name: '',
    category_id: 0,
    price: 0,
    stock_quantity: 0,
    description: ''
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.loading = true;
    this.errorMessage = '';
    
    this.productService.getAll(this.pagination.currentPage, this.pagination.pageSize).subscribe({
      next: (response) => {
        if (response.success && response.data && response.pagination) {
          this.products = response.data;
          this.pagination = response.pagination;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products';
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  openAddForm() {
    if (this.categories.length === 0) {
      this.errorMessage = 'Please create at least one category first';
      return;
    }
    
    this.showForm = true;
    this.isEditMode = false;
    this.currentProduct = {
      product_name: '',
      category_id: this.categories[0].category_id || 0,
      price: 0,
      stock_quantity: 0,
      description: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditForm(product: Product) {
    this.showForm = true;
    this.isEditMode = true;
    this.currentProduct = { ...product };
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeForm() {
    this.showForm = false;
    this.currentProduct = {
      product_name: '',
      category_id: 0,
      price: 0,
      stock_quantity: 0,
      description: ''
    };
    this.errorMessage = '';
  }

  saveProduct() {
    if (!this.currentProduct.product_name.trim()) {
      this.errorMessage = 'Product name is required';
      return;
    }
    
    if (!this.currentProduct.category_id) {
      this.errorMessage = 'Please select a category';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.currentProduct.product_id) {
      // Update existing product
      this.productService.update(this.currentProduct.product_id, this.currentProduct).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Product updated successfully';
            this.loadProducts();
            this.closeForm();
            setTimeout(() => this.successMessage = '', 3000);
          }
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to update product';
          this.loading = false;
        }
      });
    } else {
      // Create new product
      this.productService.create(this.currentProduct).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Product created successfully';
            this.loadProducts();
            this.closeForm();
            setTimeout(() => this.successMessage = '', 3000);
          }
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to create product';
          this.loading = false;
        }
      });
    }
  }

  deleteProduct(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.productService.delete(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Product deleted successfully';
          
          // If current page is empty after delete, go to previous page
          if (this.products.length === 1 && this.pagination.currentPage > 1) {
            this.pagination.currentPage--;
          }
          
          this.loadProducts();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete product';
        this.loading = false;
      }
    });
  }

  // Pagination methods
  goToPage(page: number) {
    if (page < 1 || page > this.pagination.totalPages) return;
    this.pagination.currentPage = page;
    this.loadProducts();
  }

  changePageSize(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pagination.pageSize = parseInt(select.value);
    this.pagination.currentPage = 1;
    this.loadProducts();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const currentPage = this.pagination.currentPage;
    const totalPages = this.pagination.totalPages;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
