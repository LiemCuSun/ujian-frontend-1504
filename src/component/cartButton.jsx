import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Badge, IconButton, Menu, MenuItem } from '@material-ui/core'

// import icons
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

// import styles
import '../cartButton.css'

function CartButton(props) {
    console.log(props)
    let [anchorEl, setAchorEl] = useState(null)
    let renderCount = useRef(1)
    useEffect(() => {
        renderCount.current = renderCount.current + 1
    })
    console.log(`Cart Bar button rendered ${renderCount.current} times`)

    function handleClick(e) {
        setAchorEl(e.currentTarget)
    }

    function handleClose() {
        setAchorEl(null)
    }


    console.log(props.cart)
    return (
        <div>
            <IconButton
                id="icon-button"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={(e) => handleClick(e)}
            >
                <Badge badgeContent={props.cart.length} color="primary">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                style={{
                    top: '7%',
                    left: props.cart.length !== 0 ? '-7%' : '-2.5%'
                }}
            >
                {
                    props.cart.length === 0 ?
                        <div>
                            <MenuItem id="menu-item-info">
                                <h1 id="menu-item-title">Cart is empty</h1>
                            </MenuItem>
                        </div>
                        :
                        <div>
                            {
                                props.cart.map((item, index) => (
                                    <MenuItem key={index} id="menu-item">
                                        <div style={{ backgroundImage: `url(${item.image})`, width:'100px' }} className="image-content"></div>
                                        <div className="info-container">
                                            <h6>{item.name}</h6>
                                            <h6>Rp. {item.price.toLocaleString()}, 00</h6>
                                            <h6>qty : {item.qty}</h6>
                                        </div>
                                    </MenuItem>
                                ))
                            }
                            <Link to='/cart' className="link" onClick={handleClose}>
                                <MenuItem id="menu-item-info">
                                    <h1 id="menu-item-title">Go To Cart</h1>
                                </MenuItem>
                            </Link>
                        </div>
                }
            </Menu>
        </div>
    )
}


let mapStateToProps = (props) => {
    return ({
        username: props.user.username,
        cart: props.user.cart,
        id: props.user.id
    })
}

export default connect(mapStateToProps)(CartButton)