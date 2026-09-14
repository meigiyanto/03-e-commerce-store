## 🛒 E-Commerce Store

A modern and responsive e-commerce web application built with Next.js, TypeScript, and Tailwind CSS.
This project is developed as a learning project to implement fundamental e-commerce features such as product listing, product detail pages, and shopping cart functionality.

---

### ✨ Features

- 🏠 Product listing
- 📦 Product detail page
- 🛒 Shopping cart
- ➕ Add products to cart
- ➖ Update product quantity
- 🗑️ Remove products from cart
- 📱 Responsive design
- ⚡ Fast performance with Next.js
- 🎨 Modern user interface

---

### 🛠️ Tech Stack

This project is built using:

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Zustand**
- **shadcn/ui**
- **Lucide React**

---

### 📂 Project Structure
```text
03-e-commerce-store/
├── public/
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── products/
│   │   │   └── [id]/
│   │   │
│   │   ├── cart/
│   │   │
│   │   └── ...
│   │
│   ├── components/
│   │   └── ...
│   │
│   ├── store/
│   │   └── ...
│   │
│   └── ...
│
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```
---

### 🚀 Getting Started

Prerequisites

Make sure you have installed:

- "Node.js" (https://nodejs.org/)
- npm

Check your Node.js version:
```text
node -v
```
Clone the Repository
```text
git clone https://github.com/meigiyanto/03-e-commerce-store.git
```
Move into the project directory:
```text
cd 03-e-commerce-store
```
Install Dependencies
```text
npm install
```
Run the Development Server
```text
npm run dev
```
Open your browser and visit:
```text
http://localhost:3000
```
---

### 📜 Available Scripts

Development
```
npm run dev
```
Runs the application in development mode.

Build
```text
npm run build
```
Creates an optimized production build.

Start
```text
npm run start
```

Runs the application in production mode.
```text
Lint

npm run lint
```
Checks the code using ESLint.

---

### 🛒 Shopping Cart

The shopping cart feature allows users to manage selected products.

Users can:

- Add products to the cart
- Increase product quantity
- Decrease product quantity
- Remove products from the cart
- View selected products

State management for the shopping cart is handled using Zustand.

---

### 📦 Product Detail

Each product has its own detail page using a dynamic route:
```text
/products/[id]
```
Users can view detailed product information and add products to the shopping cart.

---

### 🎨 Styling

The application uses Tailwind CSS to build a modern and responsive user interface.

Benefits include:

- Responsive layouts
- Reusable utility classes
- Consistent styling
- Faster UI development

---

### 🔮 Future Improvements

Possible future improvements include:

- ❤️ Wishlist functionality
- 🔐 User authentication
- 🔎 Product search
- 🏷️ Product categories
- 🎛️ Product filtering
- 💳 Checkout system
- 💰 Payment integration
- 📦 Order management
- 🌙 Dark mode
- 💾 Persistent shopping cart
- ⭐ Product reviews and ratings

---

### 🤝 Contributing

Contributions are welcome!

1. Fork this repository.
2. Create a new branch:
```text
git checkout -b feature/your-feature-name
```
3. Make your changes.
4. Commit your changes:
```text
git commit -m "Add your feature"
```
5. Push to your branch:
```text
git push origin feature/your-feature-name
```
6. Open a Pull Request.

---

### 📄 License

This project is intended for learning and development purposes.

---

👨‍💻 Author Mei Giyanto (*meigiyanto*)

GitHub Repository: https://github.com/meigiyanto/03-e-commerce-store

---

⭐ If you find this project useful, consider giving it a star!