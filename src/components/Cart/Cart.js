import { Fragment, useContext, useState } from "react"

import CartItem from "./CartItem"
import Modal from "../UI/Modal"
import classes from "./Cart.module.css"
import CartContext from "../../store/cart-context"
import Checkout from "./Checkout"

const Cart = (props) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [didSubmit, setDidSubmit] = useState(false)
    const cartCtx = useContext(CartContext)
    const [isCheckout, setIsCheckout] = useState()

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const orderHandler = () => {
        setIsCheckout(true)
    }

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id)
    }

    const cartItemAddHandler = (item) => {
        cartCtx.addItem({ ...item, amount: 1 })
    }

    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true)
        const response = await fetch("https://react-http-food-app-2c1c0-default-rtdb.europe-west1.firebasedatabase.app/orders.json", {
            method: "POST",
            body: JSON.stringify({
                user: userData,
                orderedItems: cartCtx.items,
            })
        })
        console.log(response)
        setIsSubmitting(false)
        setDidSubmit(true)
        cartCtx.clearCart()
    }

    const cartItems = <ul className={classes["cart-items"]}>
        {cartCtx.items.map(item => {
            return (
                <CartItem
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartItemAddHandler.bind(null, item)}
                />
            )
        })}</ul>


    const modalActions = (
        <div className={classes.actions}>
            <button className={classes["button-alt"]} onClick={props.onClose}>Close</button>
            {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
        </div>
    )

    const cartModalContent = (
        <Fragment>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
            {!isCheckout && modalActions}
        </Fragment>
    )

    const isSubmittingModalContent = <p>sending order data</p>

    const didSubmitModalContent = (
        <Fragment>
            <p>successfully ordered</p>
            <div className={classes.actions}>
            <button className={classes["button-alt"]} onClick={props.onClose}>Close</button>
        </div>
        </Fragment>
    )

    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {didSubmit && didSubmitModalContent}
        </Modal>
    )
}

export default Cart;