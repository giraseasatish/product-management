import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Form state
  showForm = false;
  isEditMode = false;
  currentCategory: Category = {
    category_name: '',
    description: ''
  };

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.errorMessage = '';
    
    this.categoryService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load categories';
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  openAddForm() {
    this.showForm = true;
    this.isEditMode = false;
    this.currentCategory = {
      category_name: '',
      description: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditForm(category: Category) {
    this.showForm = true;
    this.isEditMode = true;
    this.currentCategory = { ...category };
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeForm() {
    this.showForm = false;
    this.currentCategory = {
      category_name: '',
      description: ''
    };
    this.errorMessage = '';
  }

  saveCategory() {
    if (!this.currentCategory.category_name.trim()) {
      this.errorMessage = 'Category name is required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.currentCategory.category_id) {
      // Update existing category
      this.categoryService.update(this.currentCategory.category_id, this.currentCategory).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Category updated successfully';
            this.loadCategories();
            this.closeForm();
            setTimeout(() => this.successMessage = '', 3000);
          }
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to update category';
          this.loading = false;
        }
      });
    } else {
      // Create new category
      this.categoryService.create(this.currentCategory).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Category created successfully';
            this.loadCategories();
            this.closeForm();
            setTimeout(() => this.successMessage = '', 3000);
          }
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to create category';
          this.loading = false;
        }
      });
    }
  }

  deleteCategory(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.categoryService.delete(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Category deleted successfully';
          this.loadCategories();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete category';
        this.loading = false;
      }
    });
  }
}
