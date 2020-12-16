import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import {
    Button,
    IconButton
} from '@material-ui/core'
import {
    Table,
    Modal,
    Form
} from 'react-bootstrap'

import DeleteIcon from '@material-ui/icons/Delete'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'

import { Redirect } from 'react-router-dom'
import { URL } from '../action/helper'
// import Alert from '../component/alert'
import { login } from '../action'


//NOTE tombol edit quantity harus dikasih control total stock

function UserCart(props) {
    console.log(props)
    let [data, setData] = useState([])
    let [inventory, setInventory] = useState({
        stock: 0,
        selectedSize: null,
        size: 0,
    })

    let [password, setPassword] = useState(false)
    let [cartEmpty, setCartEmpty] = useState(false)
    let [cartErr, setCartErr] = useState(false)
    let [errPass, setErrPass] = useState(false)
    let [stockErr, setStockErr] = useState(false)
    let [selectedIndex, setSelectedIndex] = useState(null)
    let [qty, setQty] = useState({
        qty: null
    })
    let pass = useRef()

    function confPassword() {
        console.log(pass.current.value)
        if (pass.current.value === props.password) {
            setErrPass(false)
            setPassword(false)
            hanldeOk()
        } else {
            setErrPass(true)
        }
    }

    let renderCount = useRef(1)
    useEffect(() => {
        renderCount.current = renderCount.current + 1
    },[])
    console.log(`User cart rendered ${renderCount.current} times`)

    function handleDelete(index) {
        console.log(index)
        let tempCart = props.cart
        tempCart.splice(index, 1)

        // update database
        Axios.patch(URL + `/users/${props.id}`, { cart: tempCart })
            .then(res => {
                // setSelectedIndex(null)
                // setQty({ qty: null })
                Axios.get(URL + `/users/${props.id}`)
                    .then((res) => props.login(res.data))
                    .catch((err) => console.log(err))
            })
            .catch(err => console.log(err))
    }

    function handleEdit(index, qtyx) {
        console.log(index, qtyx)
        Axios.get(`http://localhost:2000/products?id=${props.cart[index].cartID}`)
            .then((res) => {
                console.log(res.data[0])
                setSelectedIndex(index)
                setData(res.data[0])
                setQty({ qty: qtyx })
                setInventory({stock: res.data[0].stock})
            })
            .catch((err) => console.log(err))
    }

    function handleCancel() {
        setSelectedIndex(null)
    }

    let tempCart = props.cart
    function handleDone() {
        if (qty.qty > inventory.stock) return setStockErr(true)
        if (qty.qty === 0) return setCartErr(true)

        console.log('function handle done executed')
        tempCart[selectedIndex].qty = qty.qty
        tempCart[selectedIndex].size = inventory.size
        tempCart[selectedIndex].stock = data.stock
        tempCart[selectedIndex].total = qty.qty * tempCart[selectedIndex].price

        // update database
        Axios.patch(URL + `/users/${props.id}`, { cart: tempCart })
            .then(res => {
                setSelectedIndex(null)
                setQty({ qty: null })

                // Axios.patch(URL + `/products/${props.cart.name}`,{ stock: stock.map((item, index)) => {}})
            })
            .catch(err => console.log(err))
    }

    function handleCheckOut() {
        if (props.cart.length === 0) return setCartEmpty(true)

        setPassword(true)
    }



    function hanldeOk() {
        let history = {
            userid: props.id,
            username: props.username,
            date: new Date().toLocaleString(),
            total: props.cart.map(item => item.total).reduce((a, b) => a + b),
            products: props.cart,
            invoice: 0,
            payment: 'belum bayar'
        }
        // console.log(history)

        // update database
        Axios.post(URL + '/transaction_history', history)
            .then(res => {

                // delete user cart
                Axios.patch(URL + `/users/${props.id}`, {cart: [] })
                    .then(res => {
                        props.login(res.data)
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    function renderTableHead() {
        return (
            <thead style={{ textAlign: "center" }}>
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }

    let totalAmount = 0
    function totAmount() {
        for (let i = 0; i < tempCart.length; i++) {
            totalAmount += tempCart[i].total
        }
        // console.log(totalAmount)
    }

    if (!props.username) return <Redirect to='/login' />
    if (props.cart.length === 0) return <Redirect to='/history' />
    console.log(qty.qty, inventory.stock)
    return (
        <div style={styles.root}>
            <div style={styles.title}>
                <h1 style={styles.subTitle}><i className="fas fa-shopping-cart"></i> User Cart</h1>
            </div>
            <Table responsive striped bordered hover variant='light'
                style={{ borderRadius: "15px", background: 'rgba(82, 192, 192, 0.5)' }}>
                {renderTableHead()}
                <tbody>
                    {
                        // NOTE penting ini supaya pas refresh ga error
                        (props.cart ? props.cart : []).map((item, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td style={{ textAlign: "center" }}>{item.name}</td>
                                <td style={{ backgroundColor: "white" }}>
                                    <img src={item.image} width="120px" alt="product-img" />
                                </td>
                                <td style={{ textAlign: "center" }}>IDR {(item.price).toLocaleString()}</td>
                                <td style={{ textAlign: "center" }}>
                                    {
                                        selectedIndex === index ?
                                            <div style={styles.qty}>
                                                <IconButton disabled={qty.qty === 0 ? true : false}
                                                    onClick={() => setQty({ qty: qty.qty - 1 })}>
                                                    <RemoveCircleIcon />
                                                </IconButton>
                                                <h5 style={styles.qtyInfo}>{qty.qty}</h5>
                                                <IconButton disabled={qty.qty >= inventory.stock ? true : false}
                                                    onClick={() => setQty({ qty: qty.qty + 1 })}>
                                                    <AddCircleIcon />
                                                </IconButton>
                                            </div>
                                            :
                                            item.qty
                                    }
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    {
                                        selectedIndex === index ?
                                            `IDR ${(item.price * qty.qty).toLocaleString()}`
                                            : `IDR ${(item.total).toLocaleString()}`
                                    }
                                </td>
                                <td>
                                    {
                                        selectedIndex === index ?
                                            <>
                                                <Button
                                                    startIcon={<DoneIcon />}
                                                    color="primary"
                                                    onClick={handleDone}
                                                >
                                                    Done
                                                </Button>
                                                <Button
                                                    startIcon={<ClearIcon />}
                                                    color="primary"
                                                    onClick={handleCancel}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                            :
                                            <>
                                                <Button
                                                    startIcon={<EditIcon />}
                                                    color="primary"
                                                    onClick={() => handleEdit(index, item.qty)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    startIcon={<DeleteIcon />}
                                                    color="secondary"
                                                    onClick={() => handleDelete(index)}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                    }
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            {totAmount()}
            <div>
                <h4 style={{ textAlign: 'right' }}>Subtotal: IDR {totalAmount ? totalAmount.toLocaleString() : 0}</h4>
            </div>
            <Button
                variant="contained"
                style={styles.checkOutButton}
                startIcon={<CreditCardIcon />}
                onClick={handleCheckOut}
            >
                Check Out
            </Button>
            <Modal show={password} onHide={() => setPassword(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Please input your password
                    <Form.Control ref={pass} type='password' placeholder="input your password" />

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={confPassword}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={errPass} onHide={() => setErrPass(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Your password does not match</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    error !
                    <Form.Control ref={pass} type='password' placeholder="input your password" />

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={confPassword}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={stockErr} onHide={() => setStockErr(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center' }}>
                        {inventory.stock === 0 ? 'THE SELECTED ITEM IS NOT AVAILABLE'
                            : `YOUR PURCHASE EXCEED STOCK (>${inventory.stock}PCS)`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    {inventory.stock === 0 ? 'PLEASE SELECT ANOTHER SIZE OR PRODUCT'
                        : `PLEASE BUY THIS PRODUCT NOT MORE THAN ${inventory.stock} PCS`}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setStockErr(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={cartEmpty} onHide={() => setCartEmpty(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center' }}>YOUR CART IS EMPTY</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    PLEASE ADD OUR PRODUCT TO CART TO CONTINUE SHOPPING
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setCartEmpty(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={cartErr} onHide={() => setCartErr(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center' }}>Edit Cart Error</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                Can not edit cart with '0' value, please delete cart instead
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setCartErr(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}


const styles = {
    root: {
        width: '100%',
        height: 'calc(100vh - 70px)',
        backgroundColor: '#f2f2f2',
        padding: '90px 10% 3% 10%',
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        margin: '2% 0px',
        color: '#130f40'
    },
    subTitle: {
        marginLeft: '1%'
    },
    deleteButton: {
        color: 'white',
        borderRadius: 0,
        padding: '10px 20px'
    },
    checkOutButton: {
        backgroundColor: '#130f40',
        color: 'white',
        borderRadius: 0,
        width: '20%',
        alignSelf: 'flex-end',
        marginTop: '3%'
    },
    tableHead: {
        fontWeight: 600,
        fontSize: 17
    },
    qty: {
        display: 'flex',
        alignItems: 'center'
    },
    qtyInfo: {
        margin: '0px 20px'
    }
}

let mapStateToProps = (props) => {
    return ({
        username: props.user.username,
        cart: props.user.cart,
        id: props.user.id,
        password: props.user.password
    })
}

export default connect(mapStateToProps, { login })(UserCart)