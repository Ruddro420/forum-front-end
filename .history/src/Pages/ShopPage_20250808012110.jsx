import { useEffect, useState } from 'react';
import {
  MessageCircle,
  Star,
  Search,
  Grid,
  List,
  Heart,
  Award,
  BookOpen,
  Video,
  Download,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_API}/books/active`) // <-- Replace with your actual endpoint
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);

          // Extract unique categories and subcategories from data
          const cats = [];
          const subs = [];
          data.data.forEach((item) => {
            if (item.category && !cats.find((c) => c.id === item.category.id)) {
              cats.push(item.category);
            }
            if (item.sub_category && !subs.find((s) => s.id === item.sub_category.id)) {
              subs.push(item.sub_category);
            }
          });

          setCategories(cats);
          setSubCategories(subs);
        }
      });
  }, []);

  console.log(products);
  

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === 'all' || product.category?.id === selectedCategory;
    const subCategoryMatch = selectedSubCategory === 'all' || product.sub_category?.id === selectedSubCategory;
    return categoryMatch && subCategoryMatch;
  });

  const getProductIcon = (type) => {
    switch (type) {
      case 'course': return Video;
      case 'ebook': return BookOpen;
      case 'template': return Download;
      case 'certification': return Award;
      case 'mentorship': return Users;
      default: return BookOpen;
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Store</h1>
        <p className="text-gray-600">Enhance your skills with premium courses, templates, and resources</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubCategory('all');
                }}
                className={`w-full p-3 rounded-lg text-left transition-colors ${selectedCategory === 'all' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedSubCategory('all');
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${selectedCategory === category.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sub Categories */}
            {selectedCategory !== 'all' && (
              <>
                <h4 className="text-md font-semibold text-gray-800 mt-6 mb-2">Sub-Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedSubCategory('all')}
                    className={`w-full p-2 rounded-lg text-left transition-colors ${selectedSubCategory === 'all' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    All Sub-Categories
                  </button>
                  {subCategories
                    .filter((sub) => sub.category_id === selectedCategory)
                    .map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubCategory(sub.id)}
                        className={`w-full p-2 rounded-lg text-left transition-colors ${selectedSubCategory === sub.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        {sub.name}
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredProducts.map((product) => {
              const ProductIcon = getProductIcon(product.type);

              return (
                <div key={product.id} className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-video'}`}>
                    <img
                      src={`${import.meta.env.VITE_SERVER_API}/storage/${product.cover_image}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex space-x-2">
                      <div className="bg-white bg-opacity-90 p-1 rounded">
                        <ProductIcon className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="p-6 flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">৳{product.price}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/chat/?seller=${product?.instructor?.id || 1}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat with Seller
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
