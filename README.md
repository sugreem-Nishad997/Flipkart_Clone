# 🛒 Flipkart Clone (MERN Stack)

A fully functional **Flipkart Clone** built using the **MERN Stack (MongoDB, Express, React, Node.js)**.  
This project demonstrates **e-commerce application development** skills including authentication, product management, cart/wishlist, payment integration, and responsive UI design.  

---
## 🚀 Live Demo

https://flipkart-clone-two-liart.vercel.app/

---
## 🚀 Features

- 🔐 **Authentication & Authorization**
  - JWT-based login/register  
  - OTP/email verification  
  - Google login integration  

- 🛍️ **E-Commerce Core**
  - Product listing with categories & search  
  - Product details with images & descriptions  
  - Add to Cart & Wishlist functionality  
  - Address management & order tracking  

- 💳 **Payment Integration**
  - Razorpay integration for secure checkout  
  - Order history & payment status tracking  

- 📊 **User Dashboard**
  - Track orders, wishlist, and account details  
  - Manage multiple shipping addresses  

- ⚡ **Admin Features**
  - Add/Edit/Delete products  
  - Manage orders & users  

- 📱 **UI/UX**
  - Responsive design (mobile-friendly)  
  - Optimized for performance with lazy loading  

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Context API / Redux, Material UI / Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT, OAuth (Google, Facebook)  
- **Payments:** Razorpay API  
- **Hosting:** Vercel (frontend) & Render (backend)  

---

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/your-username/flipkart-clone.git
cd flipkart-clone

```

Backend Setup
```bash
cd backend
npm install
npm run dev

```
Create a .env file inside server with:
```bash
DB_URL=your_mongodb_connection
SECRET_KEY=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_secret_pass
CLOUD_NAME=your_cloud_name
API_KEY=your_cloud_api_key
API_SECRET=your_cloud_api_secret
GOOGLE_CLIENT_ID=your_google_client_id

```
Frontend Setup
```bash
cd frontend
npm install
npm run dev

```
🔮 Future Enhancements

  * Product reviews & ratings

  * Delivery tracking with live updates

  * Login with Facebook

  * AI-based product recommendations


