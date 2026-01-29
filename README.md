# Product Management System

Full-stack CRUD application with **Node.js**, **Angular**, and **MySQL** featuring server-side pagination.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MySQL (v5.7+)
- npm

### Setup 

**1. Database Setup**
```bash
mysql -u root -p
CREATE DATABASE product_management;
EXIT;
mysql -u root -p product_management < backend/database/schema.sql
```

**2. Backend Setup**
```bash
cd server
npm install
# Edit .env - add your MySQL password
npm start
```

**3. Frontend Setup** 
```bash
cd client
npm install
npm start
```

**4. Open Browser**
```
http://localhost:4200
```

## ✅ Features

- ✅ Category Master (CRUD)
- ✅ Product Master (CRUD)
- ✅ Server-side Pagination
- ✅ Displays: Product ID, Product Name, Category Name, Category ID
- ✅ Adjustable page size (10, 25, 50, 100)

## 🛠️ Tech Stack

- **Backend:** Node.js + Express + MySQL
- **Frontend:** Angular 17
- **Database:** MySQL with 5 categories & 27 sample products

## 📁 Project Structure

```
├── backend/          # Node.js API (port 3000)
│   ├── routes/       # API endpoints
│   ├── config/       # Database config
│   └── database/     # SQL schema
│
├── frontend/         # Angular app (port 4200)
    ├── src/app/
    ├── components/   # Category & Product components
    └── services/     # API services
```

## 🔧 Configuration

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=product_management
DB_PORT=3306
PORT=3000
```

## 📊 Server-Side Pagination

```sql
-- Example: Page 2, Size 10 → Fetches records 11-20
SELECT * FROM products 
LIMIT 10 OFFSET 10;
```

## 🐛 Troubleshooting

**Backend not connecting?**
- Check MySQL is running
- Verify password in `.env`

**Frontend errors?**
- Ensure backend is running first
- Check `http://localhost:3000/api/health`

## 📝 API Endpoints

```
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

GET    /api/products?page=1&pageSize=10
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## 🎯 Development

```bash
# Backend (auto-restart)
npm run dev

# Frontend (live reload)
npm start
```

## 📦 Build for Production

```bash
# Frontend
cd client
npm run build
# Output: dist/product-management/

# Backend
cd server
npm start
```

## ✨ Machine Test Requirements

✅ Category Master with CRUD  
✅ Product Master with CRUD  
✅ Display: ProductId, ProductName, CategoryName, CategoryId  
✅ Server-side pagination (LIMIT/OFFSET)  
✅ Node.js + Angular + MySQL  

---

**Built By Satish Girase**
