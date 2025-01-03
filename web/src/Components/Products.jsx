import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "./Product.css";
import { NavLink } from "react-router-dom";
import SearchBar from "./Searchbar";
import Sorting from "./Sorting";

const Products = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userInterests, setUserInterests] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentSort, setCurrentSort] = useState(""); // Track current sort type
    const [selectedCategory, setSelectedCategory] = useState("All"); // Track selected category

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/products");
                if (!response.ok) throw new Error("Failed to fetch products");
                const products = await response.json();
                setData(products);
                setFilter(products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    const fetchUserInterests = async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const response = await fetch("http://localhost:5000/api/profile", {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Fixed template literal
                    }
                });
                if (response.ok) {
                    const profileData = await response.json();
                    setUserInterests(profileData.user.interests);
                    console.log("User Interests:", profileData.user.interests);

                }
            } catch (error) {
                console.error("Error fetching user interests:", error);
            }
        }
    };

    useEffect(() => {
        fetchUserInterests();
    }, []);
    
    const handleProductClick = async (category) => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) throw new Error("Token not found in local storage");

            const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Ensure safe token decoding
            const userEmail = decodedToken?.sub?.email;

            const response = await fetch("http://localhost:5000/api/register", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Fixed template literal
                },
                body: JSON.stringify({ email: userEmail, interest: category }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Error updating interests");
            }

            // Fetch updated user profile
            const response2 = await fetch("http://localhost:5000/api/profile", {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Fixed template literal
                }
            });
            if (!response2.ok) throw new Error("Failed to fetch profile");

            const profileData = await response2.json();
            setUserInterests(profileData.user.interests);
        } catch (error) {
            console.error("Error updating interests:", error);
        }
    };

    // Re-filter products whenever userInterests changes
    useEffect(() => {
        if (userInterests.length > 0) {
            const filteredProducts = data.filter(product => userInterests.includes(product.category));
            setFilter(filteredProducts);
        } else {
            setFilter(data); // If no interests, show all products
        }
    }, [userInterests, data]);

    const filterProduct = (category) => {
        let filteredProducts;

        if (category === "All") {
            filteredProducts = userInterests.length > 0
                ? data.filter(product => userInterests.includes(product.category))
                : data; 
        } else {
            filteredProducts = data.filter(product => product.category === category);
        }

        setFilter(filteredProducts);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSearchQuery(""); // Reset search query when category changes
        setCurrentSort(""); // Reset sort when category changes
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSort = (sortType) => {
        setCurrentSort(sortType);
    };

    const renderFilterButtons = () => (
        <div className="buttons d-flex justify-content-center mb-5 pb-5">
            <button className="btn btn-outline-dark me-2" onClick={() => handleCategoryChange("All")}>All</button>
            <button className="btn btn-outline-dark me-2" onClick={() => handleCategoryChange("men's clothing")}>Men Clothing</button>
            <button className="btn btn-outline-dark me-2" onClick={() => handleCategoryChange("women's clothing")}>Women Clothing</button>
            <button className="btn btn-outline-dark me-2" onClick={() => handleCategoryChange("jewelery")}>Jewelery</button>
            <button className="btn btn-outline-dark me-2" onClick={() => handleCategoryChange("electronics")}>Electronics</button>
        </div>
    );

    const ShowProducts = () => (
        <>
            <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
            <Sorting 
                onSort={handleSort} 
                currentSort={currentSort} 
                onCategoryChange={handleCategoryChange} 
                selectedCategory={selectedCategory} // Pass selected category
            />
            {renderFilterButtons()}
            {filter.map((product) => (
                <div className="col-md-3 mb-4 card-hight" key={product.id}>
                    <NavLink to={`/product/${product.id}`} className="links-product">
                        <div className="card h-100 text-center">
                            <img src={product.image} className="card-img-top ps-4 pe-4 pt-1" alt={product.title} height="250px" />
                            <div className="card-body">
                                <h5 className="card-title mb-0">{product.title.substring(0, 50)}...</h5>
                                <h4 className="card-text">
                                    ₹{parseFloat(product.price).toFixed(2)} <span className="tfprice">M.R.P</span> <span className="wrongprice tfprice">
                                        ₹{(parseFloat(product.price) * 2.3).toFixed(2)}
                                    </span>
                                </h4>
                            </div>
                        </div>
                    </NavLink>
                </div>
            ))}
        </>
    );

    const Loading = () => (
        <>
            {Array(4).fill().map((_, index) => (
                <div className="col-md-3" key={index}>
                    <Skeleton height={350} />
                </div>
            ))}
        </>
    );

    return (
        <div>
            <div className="container my-5 py-5">
                <div className="row">
                    <div className="col-12 mb-5">
                        <h1 className="display-6 fw-bolder text-center1">Latest Products</h1>
                        <hr />
                    </div>
                </div>
                <div className="row justify-content-center">
                    {loading ? <Loading /> : <ShowProducts />}
                </div>
            </div>
        </div>
    );
};

export default Products;
