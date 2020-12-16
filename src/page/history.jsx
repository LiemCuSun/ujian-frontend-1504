import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions
} from '@material-ui/core'

import {
    Table,
    Modal,
} from 'react-bootstrap'

import HistoryIcon from '@material-ui/icons/History'
import InfoIcon from '@material-ui/icons/Info'
import DeleteIcon from '@material-ui/icons/Delete'


// import action
import { URL, getHistory, login } from '../action'



function History(props) {
    console.log(props)
    console.log(props.history)
    let renderCount = useRef(1)
    console.log(`History page rendered ${renderCount.current} times`)
    renderCount.current = renderCount.current + 1

    let [alert, setAlert] = useState(false)
    let [details, setDetails] = useState([])
    let history = props.getHistory

    useEffect(() => {
        Axios.get(URL + `/transaction_history?userid=${localStorage.id}`)
            .then(res => {
                console.log(res.data)
                history(res.data)
            })
            .catch(err => console.log(err))
    }, [history])

    function handleClose() {
        setAlert(false)
    }

    function handleDetails(data) {
        setDetails(data)
        setAlert(true)
    }

    function renderTableHead() {
        return (
            <thead>
                <tr>
                    <td style={styles.tableHead}>No</td>
                    <td style={styles.tableHead}>Date</td>
                    <td style={styles.tableHead}>Total</td>
                    <td style={styles.tableHead}>Payment Status</td>
                    <td style={styles.tableHead}>Action</td>
                </tr>
            </thead>
        )
    }

    function renderTableContents() {
        return (
            props.history.map((item, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.date}</td>
                    <td>IDR {item.total.toLocaleString()}</td>
                    <td>{item.payment}</td>
                    <td>
                        <Button
                            startIcon={<InfoIcon />}
                            style={styles.details}
                            onClick={_ => handleDetails(item.products)}
                        >
                            Details
                    </Button>
                        <Button
                            startIcon={<DeleteIcon />}
                            color="secondary"
                            onClick={() => handleDelete(index)}
                        >
                            Delete
                    </Button>
                    </td>
                </tr>
            ))
        )
    }
    let [deleteConf, setdeleteConf] = useState(false)
    function handleDelete(index) {
        console.log(index, props.id)
        let tempHistory = props.history[index].id

        // update database
        Axios.delete(URL + `/transaction_history/${tempHistory}`, [])
            .then(res => {
                setdeleteConf(true)
                Axios.get(URL + `/users/${props.id}`)
                    .then((res) => {
                        props.login(res.data)
                    })
                    .catch((err) => console.log(err))
            })
            .catch(err => console.log(err))
    }

    function renderDetails() {
        return (
            (details ? details : []).map((item, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        <img src={item.image} width="70px" alt="product-img" />
                    </td>
                    <td>{item.name}</td>
                    <td>IDR {item.price.toLocaleString()}</td>
                    <td>{item.qty}</td>
                </tr>
            ))
        )
    }

    return (
        <div style={styles.root}>
            <div style={styles.title}>
                <HistoryIcon fontSize="large" />
                <h1 style={styles.subTitle}>Transaction History</h1>
            </div>
            <Table style={{ backgroundColor: 'white' }}>
                {renderTableHead()}
                <tbody>
                    {renderTableContents()}
                </tbody>
            </Table>
            <Dialog
                open={alert}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={'md'}
            >
                <DialogContent style={{ margin: 0, padding: 0 }}>
                    <Table >
                        <thead>
                            <tr>
                                <td>No</td>
                                <td>Image</td>
                                <td>Product</td>
                                <td>Price</td>
                                <td>Quantity</td>
                            </tr>
                        </thead>
                        <tbody>
                            {renderDetails()}
                        </tbody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Ok
                        </Button>
                </DialogActions>
            </Dialog>
            <Modal show={deleteConf} onHide={() => setdeleteConf(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center' }}>Transaction has been cancelled</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    transaction deleted
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setdeleteConf(false)} href='http://localhost:3000/history'>
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
        padding: '90px 10% 3% 10%'
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
    details: {
        color: '#130f40'
    },
    tableHead: {
        fontWeight: 600,
        fontSize: 17
    }
}

const mapStateToProps = (props) => {
    return {
        username: props.user.username,
        history: props.history,
        cart: props.user.cart,
        id: props.user.id,
        password: props.user.password
    }
}

export default connect(mapStateToProps, { getHistory, login })(History)