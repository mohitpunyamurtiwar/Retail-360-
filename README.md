# Retail360 – Shopkeeper Super App

## Production-Ready Kirana Store Management App

### Quick Start

1. **Prerequisites**
   ```
   Node.js 18+
   MongoDB (local or Atlas)
   ```

2. **Backend Setup**
   ```bash
   cd Retail360/backend
   npm install
   cp .env.example .env
   # Edit .env with MONGO_URI and JWT_SECRET
   npm start
   ```

3. **Frontend Setup**  
   ```bash
   cd Retail360/frontend
   npm install
   npm run dev
   ```

4. **MongoDB Setup**
   - Local: `mongod`
   - Atlas: Create free cluster, get connection string

### Features
- ✅ Offline-first PWA
- ✅ OCR Bill Scanning (Tesseract.js)
- ✅ Smart Pricing Engine
- ✅ Inventory + Stock Alerts
- ✅ Profit Dashboard
- ✅ POS Billing
- ✅ Supplier Ordering

### API Base URL: http://localhost:5000/api
### Frontend: http://localhost:5173

