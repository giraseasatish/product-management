const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all products with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        
        // Get total count for pagination
        const [countResult] = await db.query('SELECT COUNT(*) as total FROM products');
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
        
        
        // Only fetches the required records from database
        const [products] = await db.query(
            `SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                c.category_name,
                CAST(p.price AS DECIMAL(10,2)) as price,
                p.stock_quantity,
                p.description,
                p.created_at
            FROM products p
            INNER JOIN categories c ON p.category_id = c.category_id
            ORDER BY p.product_id DESC
            LIMIT ? OFFSET ?`,
            [pageSize, offset]
        );
        
        // Convert price to number for each product
        const productsWithNumbers = products.map(product => ({
            ...product,
            price: parseFloat(product.price),
            stock_quantity: parseInt(product.stock_quantity)
        }));
        
        res.json({
            success: true,
            data: productsWithNumbers,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalRecords: totalRecords,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
    try {
        const [product] = await db.query(
            `SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                c.category_name,
                CAST(p.price AS DECIMAL(10,2)) as price,
                p.stock_quantity,
                p.description,
                p.created_at
            FROM products p
            INNER JOIN categories c ON p.category_id = c.category_id
            WHERE p.product_id = ?`,
            [req.params.id]
        );
        
        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Convert price to number
        const productWithNumber = {
            ...product[0],
            price: parseFloat(product[0].price),
            stock_quantity: parseInt(product[0].stock_quantity)
        };
        
        res.json({
            success: true,
            data: productWithNumber
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
});

// CREATE new product
router.post('/', async (req, res) => {
    try {
        const { product_name, category_id, price, stock_quantity, description } = req.body;
        
        if (!product_name || !category_id) {
            return res.status(400).json({
                success: false,
                message: 'Product name and category are required'
            });
        }
        
        // Verify category exists
        const [category] = await db.query('SELECT category_id FROM categories WHERE category_id = ?', [category_id]);
        if (category.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO products (product_name, category_id, price, stock_quantity, description) VALUES (?, ?, ?, ?, ?)',
            [product_name, category_id, price || 0, stock_quantity || 0, description]
        );
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: {
                product_id: result.insertId,
                product_name,
                category_id,
                price,
                stock_quantity,
                description
            }
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
});

// UPDATE product
router.put('/:id', async (req, res) => {
    try {
        const { product_name, category_id, price, stock_quantity, description } = req.body;
        const productId = req.params.id;
        
        if (!product_name || !category_id) {
            return res.status(400).json({
                success: false,
                message: 'Product name and category are required'
            });
        }
        
        // Verify category exists
        const [category] = await db.query('SELECT category_id FROM categories WHERE category_id = ?', [category_id]);
        if (category.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        const [result] = await db.query(
            'UPDATE products SET product_name = ?, category_id = ?, price = ?, stock_quantity = ?, description = ? WHERE product_id = ?',
            [product_name, category_id, price || 0, stock_quantity || 0, description, productId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: {
                product_id: productId,
                product_name,
                category_id,
                price,
                stock_quantity,
                description
            }
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [productId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
});

module.exports = router;
