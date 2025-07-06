# Your E-commerce Store

A modern e-commerce application built with React.js for the frontend and Node.js (Express) for the backend, featuring product Browse, a shopping cart, Razorpay payment gateway integration, and a dark mode toggle.

## Table of Contents

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Setup & Installation](#setup--installation)
    * [Prerequisites](#prerequisites)
    * [Frontend Setup](#frontend-setup)
    * [Backend Setup](#backend-setup)
* [Environment Variables](#environment-variables)
* [Usage](#usage)
* [Project Structure](#project-structure)
* [Contributing](#contributing)
* [License](#license)

## Features

* **Product Listing:** Browse a wide range of products.
* **Product Details Page:** View detailed information about each product.
* **Shopping Cart:** Add, remove, and manage product quantities in your cart.
* **Filtering:** Filter products by category and price range.
* **Razorpay Payment Gateway:** Securely process payments at checkout.
    * Backend integration for creating Razorpay orders.
    * Backend verification of successful payments.
* **Dark Mode:** Toggle between light and dark themes for a personalized Browse experience.
* **Responsive Design:** Optimized for various screen sizes (mobile, tablet, desktop).
* **Toast Notifications:** User-friendly feedback for actions like adding/removing items or payment status.

## Technologies Used

**Frontend:**

* **React.js:** A JavaScript library for building user interfaces.
* **React Router DOM:** For declarative routing in React applications.
* **Context API:** For state management (Cart Context, Filter Context, Theme Context).
* **React Toastify:** For displaying stylish notifications.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

**Backend:**

* **Node.js:** JavaScript runtime.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
* **Razorpay SDK:** Official library for interacting with the Razorpay API.
* **CORS:** Middleware to enable Cross-Origin Resource Sharing.
* **Dotenv:** For loading environment variables from a `.env` file.
* **Nodemon:** (Development) For automatically restarting the Node.js server upon file changes.

## Setup & Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js) or Yarn
* A Razorpay Account (for API keys)

### Frontend Setup

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <your-repository-url>
    cd your-ecommerce-store
    ```
2.  **Navigate to the frontend directory:**
    Your React app is typically in the root or a `client`/`frontend` folder. In your case, the `package.json` at the root manages the frontend.
    ```bash
    # You should already be in the root of your project
    # e.g., your-ecommerce-store/
    ```
3.  **Install frontend dependencies:**
    ```bash
    npm install # or yarn install
    ```
4.  **Create a `.env` file for the frontend (Optional but Recommended for Production Builds):**
    If you plan to build for production and your frontend needs access to the Razorpay Key ID (though it's hardcoded in the current example, it's good practice for other public keys), create a `.env` file in the root of your project (same level as `src` and `backend`).
    ```dotenv
    REACT_APP_RAZORPAY_KEY_ID=rzp_test_9QjzWSbRRXzDC
    # Add other frontend-specific environment variables here if needed
    ```
    *Note: For `create-react-app` projects, environment variables must be prefixed with `REACT_APP_` to be accessible in the client-side code.*

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install backend dependencies:**
    ```bash
    npm install # or yarn install
    ```
3.  **Configure Environment Variables for Backend:**
    * Go back to the **root directory** of your project (i.e., `cd ..` from the `backend` folder).
    * Create a file named `.env` (if it doesn't already exist from the frontend setup) in this root directory.
    * Add your Razorpay API credentials to this file:
        ```dotenv
        RAZORPAY_KEY_ID=your_razorpay_key_id_from_dashboard
        RAZORPAY_KEY_SECRET=your_razorpay_key_secret_from_dashboard
        PORT=5000 # Or any other port you prefer for the backend
        ```
    * **IMPORTANT:** Replace `your_razorpay_key_id_from_dashboard` and `your_razorpay_key_secret_from_dashboard` with your actual keys from your Razorpay Dashboard (Settings -> API Keys). Ensure you use the correct **Test** or **Live** keys. **NEVER expose your `RAZORPAY_KEY_SECRET` in your frontend code or commit it to version control.**

## Environment Variables

Ensure you have the following `.env` files set up correctly:

**Project Root (`.env`)**

* `RAZORPAY_KEY_ID`: Your public Razorpay Key ID (e.g., `rzp_test_xxxxxxxxxxxxxx`).
* `RAZORPAY_KEY_SECRET`: Your secret Razorpay Key Secret (e.g., `yyyyyyyyyyyyyyyyyy`). **Keep this secure!**
* `PORT`: The port for your backend server (e.g., `5000`).
* `REACT_APP_RAZORPAY_KEY_ID`: (Optional for current setup, but good practice) Same as `RAZORPAY_KEY_ID`, but accessible by the frontend if using Create React App's environment variables.

## Usage

1.  **Start the Backend Server:**
    Open your terminal, navigate to the `backend` directory, and run:
    ```bash
    npm start # or npm run dev (if you installed nodemon for auto-restarts)
    ```
    You should see a message indicating the backend server is running on the specified port (e.g., `Backend server running on port 5000`).

2.  **Start the Frontend Application:**
    Open a **new** terminal window, navigate to the **root** directory of your project, and run:
    ```bash
    npm start # or yarn start
    ```
    This will usually open your application in your default web browser at `http://localhost:3000` (or another available port).

3.  **Interact with the App:**
    * Browse products, add them to your cart.
    * Proceed to the cart page.
    * Click "Proceed to Checkout" to initiate the Razorpay payment process.
    * Toggle the dark mode switch in the navigation bar to change the theme.

## Project Structure