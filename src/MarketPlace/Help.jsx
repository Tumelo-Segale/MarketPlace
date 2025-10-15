import React from 'react';
import './MarketPlace-Styles/Help.css'

export default function Help() {
    return (
        <>
            <h1 className="title">HELP & SUPPORT</h1>
            <div className="information">
                <div className="section">
                    <h1>Browse Products</h1>
                    <p>
                        Open the Marketplace page. Scroll or use filters to find products you want.
                    </p>
                </div>

                <div className="section">
                    <h1>Add to cart</h1>
                    <p>
                        Click the 'ADD TO CART' button of the product you want. Adjust the quantity if needed. 
                        A small pop up with total number of items in cart will appear. It is updated as changes are made. 
                        You can only order from a single farmer at a time
                    </p>
                </div>

                <div className="section">
                    <h1>Checkout & Pay</h1>
                    <p>
                        After Selecting all items you want, Click the green pop up and Review all items and quantity. 
                        Click 'Checkout' to complete order. You'll be redirected to a Checkout page where your full name(s) and contact number are needed, 
                        then press 'PAY WITH PAYFAST' to confirm order.
                    </p>
                </div>

                <div className="section">
                    <h1>Contact farmer</h1>
                    <p>
                        When checking out, you can send a message to farmer if needed.
                    </p>
                </div>
            </div>
        </>
    )
}
