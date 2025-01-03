// Import necessary modules and hooks
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { FaStar } from 'react-icons/fa';

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [userInterests, setUserInterests] = useState([]);
    const [ratings, setRatings] = useState({}); // Manage ratings state
    const [reviews, setReviews] = useState({}); // Manage reviews state

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
                            Authorization: `Bearer ${token}`,
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

        const handleRatingChange = (value) => {
            setRatings((prevRatings) => ({
                ...prevRatings,
                [product.id]: value // Use product id for rating
            }));
        };

        const [review, setReview] = useState('');

        // Handle change function for the textarea
        const handleReviewChange = (event) => {
            // Get the current value of the textarea
            const value = event.target.value;
            // Update the state with the new review text
            setReview(value);
        };

        const handleSubmit = async () => {
            const rating = ratings[product.id] || 0; // Default to 0 if undefined
            const review = reviews[product.id] || ''; // Default to empty string if undefined
            console.log(`Submitting for product ${product.id}: Rating = ${rating}, Review = "${review}"`);

            try {
                const response = await fetch(`http://localhost:5000/products/${product.id}/review`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ rating, review })
                });
                if (!response.ok) {
                    throw new Error('Failed to submit review');
                }
                // Optionally reset the fields after successful submission
                setRatings((prev) => ({ ...prev, [product.id]: 0 })); // Reset rating
                setReviews((prev) => ({ ...prev, [product.id]: '' })); // Reset review
                console.log("Review submitted successfully");
            } catch (error) {
                console.error("Error submitting review:", error);
            }
        };

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
                        body: JSON.stringify({ productId: product.id }) // Use product.id
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
                <div className="row mt-3">
                    <div className="col-md-4 d-flex justify-content-center align-items-center">
                        <img
                            src={product.image}
                            className="card-img-top"
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
                    </div>

                    {/* Star Rating (Amazon-style clickable stars) */}
                    <div className="order-history__rating col-md-6 mt-3">
                        <p>Rate this product:</p>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                size={24}
                                className={star <= (ratings[product.id] || 0) ? "star-filled" : "star-empty"}
                                onClick={() => handleRatingChange(star)}
                            />
                        ))}
                    </div>

                    {/* Review text area - Changed to <textarea> */}
                    <div className="order-history__review col-md-6 mt-2">
                        <textarea
                            placeholder="Write your review here..."
                            value={review} 
                            onChange={handleReviewChange}
                            className="order-history__textarea"
                            rows="4" // Set rows for better display
                            style={{ width: "100%" }} // Full width
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        className="order-history__submit-btn col-md-6 mt-2"
                        onClick={handleSubmit}>
                        Submit
                    </button>
                </div>

                <div className="related-products">
                    <h2 className="mt-5">Related Products</h2>
                    <div className="row">
                        {filteredRelatedProducts.length > 0 ? (
                            filteredRelatedProducts
                                .slice()
                                .reverse()
                                .map((relatedProduct) => {
                                    const price = parseFloat(relatedProduct.price);
                                    const discountedPrice = price - (price * 0.15); // Discounted price

                                    return (
                                        <div className="col-md-3 mb-4" key={relatedProduct.id}>
                                            <NavLink to={`/product/${relatedProduct.id}`} className="links-product">
                                                <div className="card h-100 text-center">
                                                    <img src={relatedProduct.image} className="card-img-top" alt={relatedProduct.title} height="250px" />
                                                    <div className="card-body">
                                                        <h5 className="card-title mb-0">{relatedProduct.title.substring(0, 50)}...</h5>
                                                        <h4 className="card-text">
                                                            ₹{price.toFixed(2)} <span className="tfprice">M.R.P</span> <span className="wrongprice tfprice">
                                                                ₹{discountedPrice.toFixed(2)}
                                                            </span>
                                                        </h4>
                                                    </div>
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
