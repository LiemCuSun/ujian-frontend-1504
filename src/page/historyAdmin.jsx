import React, {useRef, useEffect } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'

import {
    Table,
    Accordion,
    Image,
    Card
} from 'react-bootstrap'

import HistoryIcon from '@material-ui/icons/History'
// import InfoIcon from '@material-ui/icons/Info'

// import action
import { URL, getHistory } from '../action'


function HistoryAdmin(props) { console.log(props)
    let renderCount = useRef(1)
    console.log(`History page rendered ${renderCount.current} times`)
    renderCount.current = renderCount.current + 1

    // let [alert, setAlert] = useState(false)
    let history = props.getHistory

    useEffect(() => {
        Axios.get(URL + `/transaction_history`)
            .then(res => {
                console.log(res.data)
                history(res.data)
            })
            .catch(err => console.log(err))
    }, [history])


    return (
        <div style={{ marginTop: '100px', padding: '0 20px' }}>
            <h1><HistoryIcon fontSize="large" />Transaction History</h1>
            <Accordion>
                {(props.history ? props.history : []).map((item, index) => {
                    return (
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                                Date: {item.date}, Total Purchasing: IDR {item.total.toLocaleString()}
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={index + 1}>
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Image</th>
                                            <th>Price</th>
                                            <th>Size</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.products.map((item2, index2) => {
                                            return (
                                                <tr>
                                                    <td>{index2 + 1}</td>
                                                    <td>{item2.name}</td>
                                                    <td>
                                                        <Image src={item2.image[0]} style={{ height: 100, width: 100 }} rounded />
                                                    </td>
                                                    <td>IDR {item2.price.toLocaleString()}</td>
                                                    <td>{item2.size}</td>
                                                    <td>{item2.qty}</td>
                                                    <td>IDR {item2.total.toLocaleString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Accordion.Collapse>
                        </Card>
                    )
                })}
            </Accordion>
        </div>
    )
}

const mapStateToProps = (props) => {
    return {
        username: props.user.username,
        history: props.history,
        role: props.user.role
    }
}

export default connect(mapStateToProps, { getHistory })(HistoryAdmin)