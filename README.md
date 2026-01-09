# Chicken Ordering App - Setup Guide

## Prerequisites

Before running the application, you need to set up your PowerShell execution policy to allow running npm/npx scripts.

### Fix PowerShell Execution Policy

Open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the database with sample data**
   ```bash
   npx prisma db seed
   ```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Demo Credentials

### Staff Admin
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Menu management, discount management, order processing

### Owner
- **Username:** `owner`
- **Password:** `owner123`
- **Access:** Analytics dashboard, sales reports, data export

## Application Features

### Customer Features
- Browse menu by categories
- View menu items with prices
- Add items to cart
- Checkout with simulated payment
- Order confirmation

### Staff Features
- Dashboard with statistics
- Add/Edit/Delete menu items
- Manage promotional discounts
- View and process customer orders
- Update order status (Pending → Completed/Cancelled)

### Owner Features
- Analytics dashboard with:
  - Total revenue
  - Order statistics
  - Daily revenue trends (last 7 days)
  - Top-selling items
- Detailed sales reports
- Export sales data to CSV

## Project Structure

```
chicken-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Customer homepage
│   │   ├── login/             # Login page
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout page
│   │   ├── staff/             # Staff dashboard
│   │   │   ├── menu/          # Menu management
│   │   │   ├── discounts/     # Discount management
│   │   │   └── orders/        # Order management
│   │   └── owner/             # Owner dashboard
│   │       └── reports/       # Sales reports
│   ├── components/            # Reusable React components
│   │   ├── CartContext.tsx    # Shopping cart state management
│   │   ├── MenuCard.tsx       # Menu item card component
│   │   └── Navbar.tsx         # Navigation component
│   └── lib/                   # Utility libraries
│       ├── prisma.ts          # Prisma client
│       └── auth.ts            # Authentication utilities
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
└── dev.db                     # SQLite database
```

## Database Schema

- **User**: Staff and Owner accounts
- **Menu**: Menu items with name, description, price, category
- **Variant**: Menu variants (spicy levels, sizes, etc.)
- **Discount**: Promotional discounts with percentage and date range
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items in an order

## Troubleshooting

### Scripts not running (PowerShell error)
If you get an error about scripts being disabled, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Database not found
Run the migration and seed commands:
```bash
npx prisma migrate dev
npx prisma db seed
```

### Port 3000 already in use
Either stop the other application or change the port in `package.json`:
```json
"dev": "next dev -p 3001"
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS 4 + Custom CSS
- **Authentication:** Session-based with in-memory storage
- **State Management:** React Context API for cart
