/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
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
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_SERVER_API;
  const FILE_BASE_URL = import.meta.env.VITE_SERVER_BASE;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/data/active/books`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
          const cats = [];
          const subs = [];
          data.data.forEach((item) => {
            if (item.category && !cats.find((c) => c.id === item.category.id)) {
              cats.push(item.category);
            }
            if (
              item.sub_category &&
              !subs.find((s) => s.id === item.sub_category.id)
            ) {
              subs.push(item.sub_category);
            }
          });
          setCategories(cats);
          setSubCategories(subs);
          setLoading(false);
        }
      });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Apply category filters
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category?.id === selectedCategory);
    }
    
    if (selectedSubCategory !== "all") {
      result = result.filter(product => product.sub_category?.id === selectedSubCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply free filter
    if (showFreeOnly) {
      result = result.filter(product => parseFloat(product.price) <= 0);
    }
    
    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "price-low":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "popular":
      default:
        // Default sorting (you might want to add actual popularity logic)
        result.sort((a, b) => a.id - b.id);
        break;
    }
    
    return result;
  }, [products, selectedCategory, selectedSubCategory, searchQuery, showFreeOnly, sortBy]);

  const getProductIcon = (type) => {
    switch (type) {
      case "course":
        return Video;
      case "ebook":
        return BookOpen;
      case "template":
        return Download;
      case "certification":
        return Award;
      case "mentorship":
        return Users;
      default:
        return BookOpen;
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Learning Store
            </h1>
            <p className="text-gray-600">
              Enhance your skills with premium courses, templates, and resources
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400"
                    }`}
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
              <div className="bg-white rounded-lg border min-h-full border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Filters
                </h3>

                {/* Free Books Filter */}
                <div className="mb-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showFreeOnly}
                      onChange={() => setShowFreeOnly(!showFreeOnly)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Free Books Only</span>
                  </label>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Institutes
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedSubCategory("all");
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === "all"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    All Institutes
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedSubCategory("all");
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Sub Categories */}
                {selectedCategory !== "all" && (
                  <>
                    <h4 className="text-md font-semibold text-gray-800 mt-6 mb-2">
                      Classes
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedSubCategory("all")}
                        className={`w-full p-2 rounded-lg text-left transition-colors ${
                          selectedSubCategory === "all"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        All Classes
                      </button>
                      {subCategories
                        .filter((sub) => sub.category_id === selectedCategory)
                        .map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSubCategory(sub.id)}
                            className={`w-full p-2 rounded-lg text-left transition-colors ${
                              selectedSubCategory === sub.id
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
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
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                  {showFreeOnly && " (Free only)"}
                </p>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {filteredProducts.map((product) => {
                  const ProductIcon = getProductIcon(product.type);

                  return (
                    <div
                      key={product.id}
                      className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <div
                        className={`relative ${
                          viewMode === "list"
                            ? "w-48 flex-shrink-0"
                            : "aspect-video"
                        }`}
                      >
                        <img
                          src={`${FILE_BASE_URL}/${product.cover_image}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex space-x-2">
                          <div className="bg-white bg-opacity-90 p-1 rounded">
                            <ProductIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          {parseFloat(product.price) <= 0 && (
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Free
                            </div>
                          )}
                        </div>
                        {/* <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-white transition-colors">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button> */}
                      </div>

                      <div className="p-6 flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-2xl font-bold text-gray-900">
                            ৳{product.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-stretch gap-2">
                          <button
                            onClick={() => navigate(`/forum/chatbox`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-lg font-medium transition-colors flex items-center"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat with Seller
                          </button>
                          {parseFloat(product?.price) <= 0 &&
                            product?.book_file && (
                              <a
                                href={`${FILE_BASE_URL}/${product?.book_file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded-lg font-medium transition-colors flex items-center"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopPage;
