const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all categories
router.get('/', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories ORDER BY category_id DESC');
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
});

// GET single category by ID
router.get('/:id', async (req, res) => {
    try {
        const [category] = await db.query('SELECT * FROM categories WHERE category_id = ?', [req.params.id]);
        
        if (category.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            data: category[0]
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch category',
            error: error.message
        });
    }
});

// CREATE new category
router.post('/', async (req, res) => {
    try {
        const { category_name, description } = req.body;
        
        if (!category_name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO categories (category_name, description) VALUES (?, ?)',
            [category_name, description]
        );
        
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: {
                category_id: result.insertId,
                category_name,
                description
            }
        });
    } catch (error) {
        console.error('Error creating category:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Category name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error.message
        });
    }
});

// UPDATE category
router.put('/:id', async (req, res) => {
    try {
        const { category_name, description } = req.body;
        const categoryId = req.params.id;
        
        if (!category_name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }
        
        const [result] = await db.query(
            'UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?',
            [category_name, description, categoryId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Category updated successfully',
            data: {
                category_id: categoryId,
                category_name,
                description
            }
        });
    } catch (error) {
        console.error('Error updating category:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Category name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
            error: error.message
        });
    }
});

// DELETE category
router.delete('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // Check if category has products
        const [products] = await db.query('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [categoryId]);
        
        if (products[0].count > 0) {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete category with existing products'
            });
        }
        
        const [result] = await db.query('DELETE FROM categories WHERE category_id = ?', [categoryId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error.message
        });
    }
});

module.exports = router;
