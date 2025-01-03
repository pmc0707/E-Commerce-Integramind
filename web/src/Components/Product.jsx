import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import "./Product.css";
import DiscountBadge from "../pages/Coupons/DiscountBadge";

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [userInterests, setUserInterests] = useState([]);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/products/${id}`);
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                const productData = await response.json();
                setProduct(productData);
                fetchRelatedProducts(productData.category);
            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        const fetchRelatedProducts = async (category) => {
            try {
                const response = await fetch(`http://localhost:5000/products?category=${category}`);
                const relatedData = await response.json();
                setRelatedProducts(relatedData);
            } catch (error) {
                console.error("Error fetching related products:", error);
            }
        };

        const fetchUserInterests = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                try {
                    const response = await fetch("http://localhost:5000/api/profile", {
                        headers: {
                            Authorization: `Bearer ${token}`,  // Fixed template literal
                        }
                    });
                    if (response.ok) {
                        const profileData = await response.json();
                        setUserInterests(profileData.user.interests);
                    }
                } catch (error) {
                    console.error("Error fetching user interests:", error);
                }
            }
        };

        getProduct();
        fetchUserInterests();
    }, [id]);

    const Loading = () => <div>Loading...</div>;

    const ShowProduct = () => {
        if (!product) {
            return <div>Product not found.</div>;
        }

        // const handleAddToCart = () => {
        //     setCart(prevCart => prevCart + 1); 
        // };


        const handleAddToCart = async () => {

            const token = localStorage.getItem("access_token");

            if (token) {
                try {
                    const response = await fetch("http://localhost:5000/api/cart/add", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ productId: product.id })
                    });

                    if (response.ok) {
                        setCart(prevCart => prevCart + 1); // Update local cart count
                        console.log("Product added to cart successfully");
                    } else {
                        console.error("Failed to add product to cart");
                    }
                } catch (error) {
                    console.error("Error adding product to cart:", error);
                }
            } else {
                console.error("User is not authenticated");
            }
        };


        const filteredRelatedProducts = relatedProducts.filter((relatedProduct) =>
            userInterests.includes(relatedProduct.category)
        );

        return (
            <>
                <Navbar cart={cart} />
                <div className="row mt-3">
                    <div className="col-md-4 pBar d-flex justify-content-center align-items-center">
                        <img
                            src={product.image}
                            className="card-img-top pBarImg"
                            alt={product.title}
                        />
                    </div>
                    <div className="col-md-6">
                        <h1>{product.title}</h1>
                        <p className="lead fw-bold">Price: ₹{product.price}</p>
                        <p>{product.description}</p>
                        <NavLink className="btn btn-outline-dark" to={`/buy/${product.id}`}>Buy Now</NavLink>
                        <button onClick={handleAddToCart} className="btn btn-outline-dark ms-3">
                            Add to cart
                        </button>
                        {product.price >= 600 && product.price < 1000 && (
                        <DiscountBadge discount={'5%'} />
                    )}
                    {product.price >= 1000 && (
                        <DiscountBadge discount={'10%'} />
                    )}
                    </div>
                   
                </div>
                <div className="related-products">
                    <h2 className="mt-5">Related Products</h2>
                    <div className="row">
                        {filteredRelatedProducts.length > 0 ? (
                            filteredRelatedProducts
                                .slice()
                                .reverse()
                                .map((relatedProduct) => {
                                    const price = parseFloat(relatedProduct.price); // Ensure it's a number
                                    const discountedPrice = price - (price * 0.15); // Discounted price should be lower

                                    return (
                                        <div className="col-md-3 mb-4" key={relatedProduct.id}>
                                            <NavLink to={`/product/${relatedProduct.id}`} className="links-product">  {/* Fixed template literal */}
                                                <div className="card h-100 text-center card-hight">
                                                    <img src={relatedProduct.image} className="card-img-top2" alt={relatedProduct.title} height="250px" />
                                                    <div className="card-body">
                                                        <h5 className="card-title mb-0">{relatedProduct.title.substring(0, 50)}...</h5>
                                                        <h4 className="card-text">
                                                            ₹{price.toFixed(2)} <span className="tfprice">M.R.P</span> <span className="wrongprice tfprice">
                                                                ₹{discountedPrice.toFixed(2)} {/* Now showing the discounted price */}
                                                            </span>
                                                        </h4>
                                                    </div>
                                                    {relatedProduct.price >= 600 && relatedProduct.price < 1000 && (
                                                        <DiscountBadge discount={'5%'} />
                                                    )}
                                                    {relatedProduct.price >= 1000 && (
                                                        <DiscountBadge discount={'10%'} />
                                                    )}
                                                </div>
                                            </NavLink>
                                        </div>
                                    );
                                })
                        ) : (
                            <div>No related products based on your interests.</div>
                        )}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="container py-5">
            <div className="row">
                {loading ? <Loading /> : <ShowProduct />}
            </div>
        </div>
    );
};

export default Product;
