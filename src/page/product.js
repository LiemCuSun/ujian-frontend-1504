import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'
import {
    Button,
    Card,
    Modal,
    Toast
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { login } from '../action'





function Products(props) {
    console.log(props)
    let renderCount = useRef(1)
    renderCount.current = renderCount.current + 1
    let [data, setData] = useState([])
    let [notif, setNotif] = useState(false)


    let [productID, setproductID] = useState()
    let [prodtempID, setprodtempID] = useState()
    let [prodtempName, setprodtempName] = useState()
    let [prodtempImg, setprodtempImg] = useState()
    let [prodtempPrice, setprodtempPrice] = useState()
    let [prodtempStock, setprodtempStock] = useState()
    let [prodtempDesc, setprodtempDesc] = useState()

    useEffect(() => {
        Axios.get("http://localhost:2000/products")
            .then((res) => {
                setData(res.data)
                Axios.get(`http://localhost:2000/products?id=${productID}`)
                    .then((res) => {
                        console.log(res.data)
                        setprodtempID(res.data[0].id)
                        setprodtempName(res.data[0].name)
                        setprodtempImg(res.data[0].img)
                        setprodtempPrice(res.data[0].price)
                        setprodtempStock(res.data[0].stock)
                        setprodtempDesc(res.data[0].description)
                        console.log('tempId =', prodtempID, 'tempName =', prodtempName, 'tempImg =', prodtempImg, 'tempPrice =', prodtempPrice, 'tempstock =', prodtempStock, 'tempdesc =', prodtempDesc)
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))


    }, [prodtempDesc, prodtempID, prodtempImg, prodtempName, prodtempPrice, prodtempStock, productID])

    let [popupCart, setpopupCart] = useState(false)
    let [cartErr, setCartErr] = useState(false)
    let [LoginErr, setLoginErr] = useState(false)
    let [Quantity, setQuantity] = useState(1)

    function handleAddToChart() {
        if (Quantity === 0 || prodtempStock === 0) return setCartErr(true)
        console.log("added item to cart")

        let cartData = {
            cartID: prodtempID,
            name: prodtempName,
            image: prodtempImg,
            category: 'no data',
            brand: 'no data',
            colour: 'no data',
            price: prodtempPrice,
            size: 'no data',
            qty: Quantity,
            total: Quantity * prodtempPrice,
            stock: prodtempStock
        }
        console.log(cartData)
        let cartQty = 0
        let tempCart = props.cart
        props.cart.map((item, index) => {
            if (prodtempID === item.cartID) return cartQty += item.qty
            return ('')
        })
        console.log(cartQty)
        if (cartQty + cartData.qty > prodtempStock) return alert('Out of stock')
        tempCart.push(cartData)

        Axios.patch(`http://localhost:2000/users/${props.id}`, { cart: tempCart })
            .then((res) => {
                props.login(res.data)
                console.log(res.data)
                setQuantity(1)
                setpopupCart(false)
                setNotif(true)
            })
            .catch((err) => console.log(err))
    }



    function handlePopUp(data) {
        console.log(data)
        setproductID(data)
        if (!props.username) return setLoginErr(true)
        setpopupCart(true)



    }

    // console.log(data)
    console.log(`Products component rendered ${renderCount.current} times`)
    return (
        <div styles={{ padding: "50px", }}>
            <Toast show={notif} onClose={() => setNotif(false)} style={{backgroundColor:'black'}}>
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded mr-2"
                        alt=""
                    />
                    <strong className="mr-auto">Added item to cart</strong>
                    <small>just now</small>
                </Toast.Header>
                <Toast.Body style={{color:'white'}}>Your item added to cart !!</Toast.Body>
            </Toast>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                <h1 style={{ width: "100vw", marginLeft: '40px' }}>Our Products</h1>
                {data.map((item, index) => {
                    return (
                        <Card key={index} style={{ width: '18rem', marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                            <Card.Img variant="top" src={item.img} />
                            <Card.Body style={styles.cardBody}>
                                <Card.Title>{item.name}</Card.Title>
                                <h6>Available stock: {item.stock ? item.stock : 0}</h6>
                                <h6>Price: IDR {item.price ? item.price.toLocaleString() : 0}</h6>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: "10px" }}>
                                    <Button variant="warning" >Wish List</Button>
                                    <Button variant="primary" onClick={(e) => handlePopUp(item.id)} value={item.id}>Buy Now</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
            <Modal show={popupCart} onHide={() => setpopupCart(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Product Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ marginTop: '0px' }}>
                        <div style={{ display: "flex", height: "40vh", }}>
                            <div style={{ display: "flex", flexBasis: "40%", }}>
                                <img src={prodtempImg} alt="product" style={{ width: '200px', height: '200px' }} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", flexBasis: "60%", padding: "0 20px" }}>
                                <h2>{prodtempName}</h2>
                                <h6>Price: IDR {prodtempPrice ? prodtempPrice.toLocaleString() : 0}</h6>
                                <div>
                                    <div style={{ marginRight: '50px' }}>
                                        <h6>* available stock = {prodtempStock}</h6>
                                    </div>
                                    <div>
                                        <h6>Quantity (Max Purchases {prodtempStock}) :</h6>
                                        <div style={{ display: 'flex', borderRadius: '10px', backgroundColor: '#ffffff', justifyContent: 'space-between', padding: "10px" }}>
                                            <Button
                                                disabled={Quantity <= 0 ? true : false}
                                                onClick={() => setQuantity(Quantity - 1)}
                                                variant="danger"
                                            > - </Button>
                                            <h1 style={{ margin: "0 0" }}>{Quantity}</h1>
                                            <Button
                                                disabled={Quantity >= prodtempStock ? true : false}
                                                onClick={() => setQuantity(Quantity + 1)}
                                                variant="primary"
                                            > + </Button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <Button onClick={handleAddToChart}>Add to Cart</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setpopupCart(false)}>
                        Close
                            </Button>
                </Modal.Footer>
            </Modal>
            {/* NOTE dibawah ini modal untuk alert */}
            {/* NOTE Modal untuk alert kalau belum login */}
            <Modal show={LoginErr} onHide={() => setLoginErr(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Please Log In to Continue</Modal.Title>
                </Modal.Header>
                <Modal.Body>Login first before put any product to cart !</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" as={Link} to='/login' style={{ marginRight: '10px' }}>
                        Proceed to login page
                    </Button>
                    <Button variant="secondary" onClick={() => setLoginErr(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={cartErr} onHide={() => setCartErr(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please choose at least 1 quantity!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCartErr(false)}>
                        Okay
                            </Button>
                </Modal.Footer>
            </Modal>

            
        </div>

    )
}

const styles = {
    cardBody: {
        // backgroundColor: 'lightgreen',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
}

let mapStateToProps = (props) => {
    return ({
        username: props.user.username,
        cart: props.user.cart,
        id: props.user.id,
    })
}

export default connect(mapStateToProps, { login })(Products)