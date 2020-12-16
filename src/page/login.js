import Axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import {
    Button,
    InputGroup,
    FormControl,
    Modal,
    Form,
} from 'react-bootstrap'

// import action untuk login dan logout
import {
    login,
    logout
} from '../action'

// import connect redux
import { connect } from "react-redux"

// import redirect from react router-dom
import { Redirect } from "react-router-dom"

function Login(props) {
    // NOTE nyobain useEffect 
    let renderCount = useRef(1)
    useEffect(() => {
        renderCount.current = renderCount.current + 1
    }, [])

    const URL = 'http://localhost:2000/users'
    let usernameRef = useRef('')
    let passwordRef = useRef('')
    console.log(usernameRef, passwordRef)



    // function handleUsersChange(e) {
    //     setUsers(e.target.value)
    // }

    let [visible, setVisible] = useState(false)

    let [regErr, setRegErr] = useState([false, ""])

    function handleLogin(x) {
        let email = usernameRef.current.value
        let password = passwordRef.current.value
        console.log(email, password)
        if (!email || !password) return setRegErr([true, 'Please do not leave any form blank !'])

        if (emailValidErr || passValidErr) return setRegErr([true, "Make sure there is no error in validation"])

        // axios get untuk menyaring email
        Axios.get(`${URL}?email=${email}`)
            .then((res) => {
                console.log(res.data)
                if (res.data.length !== 0) {
                    Axios.get(`http://localhost:2000/users?email=${email}&password=${password}`)
                        .then((res2) => {
                            console.log(res2.data)
                            if (res2.data.length === 0) return setRegErr([true, 'Invalid username or password'])

                            props.login(res2.data[0])
                            // localStorage.setItem("username", username) ini syntax lebih panjang
                            localStorage.username = email
                            localStorage.id = res2.data[0].id
                            console.log(localStorage.id)
                        })
                        .catch((err2) => console.log(err2))
                } else {
                    Axios.get(`${URL}?email=${email}`)
                        .then((res) => {
                            console.log(res.data)
                            if (res.data.length === 0) {

                                // return setRegErr([true, "Account with this email is already used"])

                                // kalau tidak ada akun dengan username dan email yang sama, maka axios post akan berjalan
                                Axios.post('http://localhost:2000/users', {
                                    username: email,
                                    password: password,
                                    role: "user",
                                    email: email,
                                    cart: []
                                })
                                    .then((res1) => {
                                        console.log(res1.data)
                                        console.log('Register berhasil')
                                        this.setState({ regError: [false, ""] })
                                        this.setState({ signUpCon: true })

                                    })
                                    .catch((err1) => console.log(err1))
                            }
                        })
                        .catch((err) => console.log(err))
                }
            })
            .catch((err) => console.log(err))
        // let username = this.refs.username.value NOTE ini cara lama yg pake state
        // let password = this.refs.password.value
        console.log(x)
    }

    let [emailValidErr, setemailValidErr] = useState(false)
    function emailValid(e) {
        console.log(e)
        let email = e.target.value
        // console.log(username)
        // let symbol = /[!@#$%^&*@]/
        let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // NOTE: !regex.test karna kita ingin format email sesuai dengan regex diatas
        // NOTE: berbanding terbalik dengan yang proteksi user
        if (!regex.test(email)) return setemailValidErr(true)

        setemailValidErr(false)
    }

    let [passValidErr, setpassValidErr] = useState(false)
    function passValid(e) {
        // char min 6
        // ada symbol
        // ada angka
        let pass = e.target.value
        // console.log(pass)
        let symb = /[!@#$%^&*:]/
        let numb = /[0-9]/
        // let upper = /[A-Z]/

        if (!symb.test(pass) || !numb.test(pass) || pass.length < 6) return setpassValidErr(true)

        setpassValidErr(false)
    }

    if (props.username) return <Redirect to='/' />
    console.log(usernameRef.current.value)
    console.log(`login page rendered ${renderCount.current} times`)
    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h1 style={{ display: "flex", justifyContent: "center" }}>Login</h1>
                <p>Email</p>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                            <i className="fas fa-user"></i>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        ref={usernameRef}
                        placeholder="Insert Email"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        onChange={(e) => emailValid(e)}
                    />
                    <InputGroup.Append>
                        <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
                <Form.Text style={{ color: "red" }}>
                    {emailValidErr ? "email not valid" : ""}
                </Form.Text>
                <p>Password</p>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend style={{ cursor: 'pointer', width: '40px' }}
                        onClick={() => setVisible(!visible)}>
                        <InputGroup.Text id="basic-addon1">
                            <i className={visible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                            {/* {visible ? <i class="fas fa-eye"></i> : <i class="fas fa-eye-slash"></i>} */}
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        ref={passwordRef}
                        placeholder="password"
                        aria-label="password"
                        type={visible ? "text" : "password"}
                        aria-describedby="basic-addon1"
                        onChange={(e) => passValid(e)}
                    />
                </InputGroup>
                <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                    {passValidErr ? 'Must include symbol, number, min 6 char' : ""}
                </Form.Text>
                <div style={{ display: "flex", justifyContent: "center", }}>
                    <Button onClick={handleLogin} variant='primary' style={{ marginTop: "20px", }}>Login/Register</Button>
                </div>
                <Modal show={regErr[0]} onHide={() => setRegErr([false, ""])} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{regErr[1]}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setRegErr([false, ""])}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

const styles = {
    container: {
        width: '400px',
        background: 'rgba(82, 192, 192, 0.7)',
        padding: '10px',
        borderRadius: '15px',
        marginTop: '200px',
        height: '400px',
    },
    item: {
        margin: '15px 0'
    },
    background: {
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        background: "url(https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80) no-repeat center",
        backgroundSize: '100vw 100vh'
    }
}


let mapStateToProps = (props) => {
    return ({
        username: props.user.username,
        id: props.user.id
    })
}


export default connect(mapStateToProps, { login, logout })(Login)