import { useState, useEffect } from 'react';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [userProducts, setUserProducts] = useState([]); // To store products added by the user
    const [editIndex, setEditIndex] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
        rating: { rate: '', count: '' },
    });
    const [isFormVisible, setFormVisible] = useState(false);
    const [ownerName, setOwnerName] = useState(''); // New state for ownerName

    // Fetch user's profile data when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("access_token");
            try {
                const response = await fetch('http://localhost:5000/api/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // console.log(data)
                    setOwnerName(data.user.fullName); 
                
                    const userProductsIds = data.user.yourProducts;
                    setUserProducts(userProductsIds);
                } else {
                    console.error('Failed to fetch user profile');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUserProfile();
    }, []);

    // Fetch products from API when component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
                if (response.ok) {
                    const allProducts = await response.json();
                    const filteredProducts = allProducts.filter(product => 
                        userProducts.includes(product.id) 
                        
                    );
                    setProducts(filteredProducts);
                    console.log(userProducts)
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProducts();
    }, [userProducts]); // Run when userProducts changes

    const showAddProductForm = () => {
        setFormVisible(true);
        setFormData({
            title: '',
            price: '',
            description: '',
            category: '',
            image: '',
            rating: { rate: '', count: '' },
        });
        setEditIndex(null);
    };

    const hideProductForm = () => {
        setFormVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'rate' || name === 'count') {
            setFormData((prevData) => ({
                ...prevData,
                rating: {
                    ...prevData.rating,
                    [name]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const saveProduct = async (e) => {
        e.preventDefault();

        const newProduct = {
            id: Math.floor(Math.random() * 1000000), // Generate a random ID
            title: formData.title,
            price: formData.price,
            description: formData.description,
            category: formData.category,
            image: formData.image,
            rating: {
                rate: formData.rating.rate,
                count: formData.rating.count,
            },
            ownerName: ownerName // Add the owner's name to the new product
        };

        try {
            // Step 1: Add the new product
            const response = await fetch('http://localhost:5000/products/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                const addedProduct = await response.json();
            
                // Step 2: Update the admin's profile with the new product ID
                const token = localStorage.getItem("access_token");
                const updateResponse = await fetch(`http://localhost:5000/api/profile/update`, {
                    method: 'PUT', // Changed from PATCH to PUT
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ productId: addedProduct.id }), // Send the new product ID
                });
            
                if (updateResponse.ok) {
                    setProducts((prev) => [...prev, newProduct]);
                    setUserProducts((prev) => [...prev, newProduct.id]); // Update user products
                } else {
                    console.error('Failed to update user profile with new product ID');
                }
            } else {
                console.error('Failed to add product');
            }
            
        } catch (error) {
            console.error('Error:', error);
        }

        hideProductForm();
    };

    const editProduct = (index) => {
        setFormVisible(true);
        setFormData(products[index]);
        setEditIndex(index);
    };

    const deleteProduct = async () => {
        if (editIndex !== null) {
            const productToDelete = products[editIndex];

            try {
                const response = await fetch(`http://localhost:5000/products/delete/${productToDelete.id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const updatedProducts = products.filter((_, index) => index !== editIndex);
                    setProducts(updatedProducts);
                    setUserProducts((prev) => prev.filter(id => id !== productToDelete.id)); // Remove from user's products
                } else {
                    console.error('Failed to delete product');
                }
            } catch (error) {
                console.error('Error:', error);
            }
            hideProductForm();
        }
    };

    return (
        <div className="product-button-box">
            <div id="product-listing">
                <h1>Product List</h1>
                <table id="productTable" border="1">
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td>
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            style={{ width: '50px', height: '50px' }}
                                            onClick={() => openModal(product.image)}
                                        />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                                <td>{product.title}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.rating.rate}</td>
                                <td>{product.rating.count}</td>
                                <td>
                                    <button className="btn" onClick={() => editProduct(index)}>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!isFormVisible && (
                    <button onClick={showAddProductForm}>Add Product</button>
                )}
            </div>

            {isFormVisible && (
                <div id="product-form">
                    <h1>{editIndex === null ? 'Add Product' : 'Edit Product'}</h1>
                    <form onSubmit={saveProduct}>
                        <label htmlFor="productTitle">Title:</label>
                        <input
                            type="text"
                            id="productTitle"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <label htmlFor="productPrice">Price:</label>
                        <input
                            type="number"
                            id="productPrice"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <label htmlFor="productDescription">Description:</label>
                        <input
                            type="text"
                            id="productDescription"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <label htmlFor="productCategory">Category:</label>
                        <input
                            type="text"
                            id="productCategory"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <label htmlFor="productImage">Image URL:</label>
                        <input
                            type="text"
                            id="productImage"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <label htmlFor="productRate">Rating (Rate):</label>
                        <input
                            type="number"
                            step="0.1"
                            id="productRate"
                            name="rate"
                            value={formData.rating.rate}
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <label htmlFor="productCount">Rating (Count):</label>
                        <input
                            type="number"
                            id="productCount"
                            name="count"
                            value={formData.rating.count}
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <button type="submit">Save</button>
                        {editIndex !== null && (
                            <button type="button" onClick={deleteProduct}>
                                Delete
                            </button>
                        )}
                        <button type="button" onClick={hideProductForm}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductList;
