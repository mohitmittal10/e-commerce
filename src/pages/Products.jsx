import products from "../data/products";
import ProductCard from "../components/ProductCard";
import { useFilter } from "../context/filterContext";
import { useState } from "react"; // Import useState

const Products = () => {
  const { filteredProducts, categories, selectedCategory, setSelectedCategory, selectedPrice, setSelectedPrice } = useFilter();

  // New state to manage the layout view (default to 'grid')
  const [viewMode, setViewMode] = useState('grid'); 

  return (
    <section className="py-12 px-6 md:px-12 bg-gray-50 min-h-[50vh] h-full">
      <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
        All Products
      </h2>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <div>
          <label className="mr-2 font-medium">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-44 focus:outline-orange-400"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mx-2 font-medium">Price:</label>
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-44 focus:outline-orange-400"
          >
            <option value="">All</option>
            <option value="0-500">Under ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000-2000">₹1000 - ₹2000</option>
            <option value="2000+">₹2000+</option>
          </select>
        </div>

        {/* New View Mode Controls */}
        <div>
          <label className="mx-2 font-medium">View:</label>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 border rounded-l-md ${
              viewMode === 'grid' ? 'bg-orange-500 text-white' : 'border-gray-300 text-gray-700'
            } focus:outline-none`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 border rounded-r-md ${
              viewMode === 'list' ? 'bg-orange-500 text-white' : 'border-gray-300 text-gray-700'
            } focus:outline-none`}
          >
            List
          </button>
        </div>
      </div>

      {/* Product Grid/List */}
      <div 
        className={`max-w-6xl mx-auto ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' 
            : 'flex flex-col gap-4' // Flex column for list view
        }`}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard product={product} key={product.id} viewMode={viewMode} /> // Pass viewMode to ProductCard
          ))
        ) : (
          <p className="text-center col-span-full">No products found.</p>
        )}
      </div>
    </section>
  );
};

export default Products;