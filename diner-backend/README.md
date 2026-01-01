# 🍽️ Diner Backend API

A **production-grade, scalable backend API** for the American Diner with Latin Twist restaurant. Built with Node.js, Express, TypeScript, and MongoDB.

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based authentication
- Admin and staff role management
- Secure password hashing with bcrypt
- Protected routes with middleware

### 📋 **Menu Management**
- Full CRUD operations for menu items
- Category-based organization
- Happy hour pricing support
- Availability toggling
- Dietary information (vegetarian, gluten-free, kids menu)

### 🛒 **Order Management**
- Create and track orders
- Order status workflow (pending → confirmed → preparing → ready → completed)
- Payment integration (Stripe-ready)
- Support for dine-in and takeaway
- Order history and analytics

### ⏰ **Business Logic**
- Happy hour timing and pricing
- Business hours validation
- Automatic order number generation
- Tax calculation (7% Florida sales tax)

### 📊 **Admin Dashboard**
- Real-time statistics
- Order analytics
- Popular items tracking
- Revenue reporting
- Business status monitoring

### 🔒 **Security**
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with express-validator
- Environment-based configuration

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or MongoDB Atlas)
- **Stripe account** (for payment processing - optional)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd diner-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A strong random string for JWT signing
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (optional)
   - `FRONTEND_URL` - Your frontend URL (default: http://localhost:3000)

4. **Initialize the database:**
   ```bash
   # Create default admin user
   npm run init-admin
   
   # Seed menu items (optional)
   npm run seed-menu
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

---

## 📁 Project Structure

```
diner-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── models/
│   │   ├── Menu.ts              # Menu item schema
│   │   ├── Order.ts              # Order schema
│   │   └── User.ts               # User/Admin schema
│   ├── routes/
│   │   ├── auth.ts               # Authentication routes
│   │   ├── menu.ts               # Menu CRUD routes
│   │   ├── orders.ts             # Order management routes
│   │   └── admin.ts              # Admin dashboard routes
│   ├── middleware/
│   │   ├── auth.ts               # JWT authentication
│   │   ├── errorHandler.ts       # Error handling
│   │   └── rateLimiter.ts        # Rate limiting
│   ├── utils/
│   │   ├── happyHour.ts          # Happy hour logic
│   │   ├── payment.ts            # Stripe integration
│   │   └── generateToken.ts      # JWT token generation
│   ├── scripts/
│   │   ├── initAdmin.ts          # Initialize admin user
│   │   └── seedMenu.ts           # Seed menu data
│   └── server.ts                 # Express server setup
├── .env.example                  # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new admin (admin only)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Menu

- `GET /api/menu` - Get all menu items (public)
- `GET /api/menu/:id` - Get single menu item (public)
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Orders

- `POST /api/orders` - Create new order (public)
- `GET /api/orders/:id` - Get order by ID (public)
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)
- `POST /api/orders/:id/confirm-payment` - Confirm payment (admin)

### Admin

- `GET /api/admin/dashboard` - Get dashboard stats (admin)
- `GET /api/admin/orders/stats` - Get order statistics (admin)

### Health Check

- `GET /health` - Server health check

---

## 🔐 Authentication

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@diner.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "_id": "...",
  "email": "admin@diner.com",
  "name": "Admin",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using the Token

Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

---

## 📝 Example API Calls

### Create Order

```bash
POST /api/orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "items": [
    {
      "menuItemId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "quantity": 2
    }
  ],
  "deliveryType": "dine-in",
  "paymentMethod": "card"
}
```

### Update Order Status (Admin)

```bash
PUT /api/orders/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "preparing"
}
```

---

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run init-admin` - Create default admin user
- `npm run seed-menu` - Seed menu items

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/diner-db |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `STRIPE_SECRET_KEY` | Stripe secret key | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `OPENING_HOUR` | Business opening hour | 8 |
| `CLOSING_HOUR` | Business closing hour | 15 |
| `HAPPY_HOUR_START` | Happy hour start | 11 |
| `HAPPY_HOUR_END` | Happy hour end | 13 |

---

## 💳 Payment Integration

The backend is ready for Stripe integration:

1. Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Add `STRIPE_SECRET_KEY` to `.env`
3. Payment intents are automatically created for card/NFC orders
4. Webhook handling can be added for payment confirmations

---

## 🚢 Deployment

### Deploy to Render

1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Build command: `npm run build`
4. Start command: `npm start`

### Deploy to Heroku

```bash
heroku create diner-backend
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

### Deploy to Railway

1. Connect your repository
2. Add environment variables
3. Railway will auto-detect and deploy

---

## 📊 Database Schema

### MenuItem
- name, description, price, category
- isVegetarian, isGlutenFree, isKids
- isAvailable, happyHourPrice
- timestamps

### Order
- orderNumber (auto-generated)
- customerName, customerEmail, customerPhone
- items (array with quantity, price, subtotal)
- subtotal, tax, total
- status, paymentStatus, paymentMethod
- deliveryType, specialInstructions
- timestamps

### User
- email, password (hashed), name
- role (admin/staff)
- isActive, lastLogin
- timestamps

---

## 🔒 Security Best Practices

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Rate limiting on all routes
- ✅ Input validation
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Environment variables for secrets

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running (local) or connection string is correct (Atlas)

### JWT Token Invalid
- Verify `JWT_SECRET` is set correctly
- Check token expiration

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process: `npx kill-port 5000`

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## 📄 License

This project is private and proprietary.

---

## 👨‍💻 Development Notes

- All routes are TypeScript-typed
- Error handling is centralized
- Business logic is separated into utilities
- Ready for horizontal scaling
- Production-ready code structure

---

**Built with ❤️ for a premium restaurant experience.**

