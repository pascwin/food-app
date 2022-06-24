import { useContext, useEffect, useState } from "react";

import CartIcon from "../Cart/CartIcon";
import CartContext from "../../store/cart-context";
import classes from "./HeaderCartButton.module.css"

const HeaderCartButton = props => {
    const cartCtx = useContext(CartContext)
    const [btnIsHighlighted, setBtnIsHighlighted] = useState(false)

    const numberOfCartItems = cartCtx.items.reduce((currNumber, item) => {
        return currNumber + item.amount;
    }, 0)

    
 
    const btnClass = `${classes.button} ${btnIsHighlighted ? classes.bump : ""}`

    useEffect(() => {
        if(cartCtx.items.length === 0) {
            return;
        }
        setBtnIsHighlighted(true)

        const timer = setTimeout(() => {
            setBtnIsHighlighted(false)
        }, 300);

        return () => {
            clearTimeout(timer);
        }
    }, [cartCtx.items])
    
    return <button className={btnClass} onClick={props.onShowCart}>
        <span className={classes.icon}>
            <CartIcon />
        </span>
        <span>
            Your Cart
        </span>
        <span className={classes.badge}>
            {numberOfCartItems}
        </span>
    </button>
}

export default HeaderCartButton;