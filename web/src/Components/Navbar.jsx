import React, { useState, useEffect } from "react";
import './Navbar.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons'; 
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {
        const fetchCartProducts = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                try {
                    const response = await fetch("http://localhost:5000/api/cart", {
                        headers: {
                            "Authorization": Bearer `${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch cart products");
                    }

                    const products = await response.json();
                    setCartProducts(products);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchCartProducts();
    }, []);

    return (
        <div>
            <nav className="navbar navar-expand-lg navbar-light bg-white shadow-sm mleft custom-margin-bottom ">
                <NavLink to="/cart" className="btn btn-outline-dark sleft">
                    <FontAwesomeIcon icon={faCartArrowDown} className="custom-icon" /> 
                    Cart ({cartProducts.length}) {/* Displaying the length of the cart */}
                </NavLink>
                <NavLink to="/" className="navbar-brand fw-bold fs-4">
                    <h1 className='sright'>INTEGRA SHOP</h1>
                </NavLink>
            </nav>
        </div>
    );
}

export default Navbar;