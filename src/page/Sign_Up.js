import React from 'react'
import Axios from 'axios'
import {
    Button,
    InputGroup,
    FormControl,
    Form,
    Modal
} from 'react-bootstrap'

// import redirect from react router-dom
import { Redirect } from "react-router-dom"

const URL = 'http://localhost:2000/users'

export default class signUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dbUsers: {},
            signUpCon: false,
            visible: false,
            visible_cp: false,
            userValidErr: [false, ""],
            passValidErr: [false, ""],
            emailValidErr: [false, ""],
            regError: [false, ""],
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:2000/users')
            .then((res) => {
                console.log(res.data)
                this.setState({ dbUsers: res.data })
            })
            .catch((err) => console.log(err))
    }


    handleAdd = () => {
        const { userValidErr, emailValidErr, passValidErr } = this.state
        let username = this.refs.username.value
        let password = this.refs.password.value
        let email = this.refs.email.value
        let confpass = this.refs.confirm_password.value
        console.log(username, password, email, confpass)
        if (!username || !password || !email || !confpass) return this.setState({ regError: [true, 'Please do not leave any form blank !'] })

        if (confpass !== password) return this.setState({ regError: [true, 'Password does not match with Confirm Password'] })

        if (userValidErr[0] || emailValidErr[0] || passValidErr[0]) return this.setState({ regError: [true, "Make sure there is no error in validation"] })

        // axios get untuk menyaring username 
        Axios.get(`${URL}?username=${username}`)
            .then((res) => {
                console.log(res.data)
                if (res.data.length !== 0) return this.setState({ regError: [true, "Account with this username is already used"] })

                // axios get untuk menyaring email
                Axios.get(`${URL}?email=${email}`)
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.length !== 0) return this.setState({ regError: [true, "Account with this email is already used"] })

                        // kalau tidak ada akun dengan username dan email yang sama, maka axios post akan berjalan
                        Axios.post('http://localhost:2000/users', {
                            username: username,
                            password: password,
                            role: "user",
                            email: email,
                            cart: []
                        })
                            .then((res) => {
                                console.log(res.data)
                                console.log('Register berhasil')
                                this.setState({ regError: [false, ""] })
                                this.setState({ signUpCon: true})
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }


    userValid = (e) => {
        console.log(e)
        let username = e.target.value
        // console.log(username)
        let symbol = /[!@#$%^&*@]/

        if (symbol.test(username) || username.length < 5) return this.setState({ userValidErr: [true, "*Can\\'t include symbol and min 6 char"] })

        this.setState({ userValidErr: [false, ""] })
    }

    passValid = (e) => {
        // char min 6
        // ada symbol
        // ada angka
        let pass = e.target.value
        // console.log(pass)
        let symb = /[!@#$%^&*:]/
        let numb = /[0-9]/
        // let upper = /[A-Z]/

        if (!symb.test(pass) || !numb.test(pass) || pass.length < 6) return this.setState({ passValidErr: [true, "*Must include symbol, number, min 6 char"] })

        this.setState({ passValidErr: [false, ""] })
    }

    emailValid = (e) => {
        console.log(e)
        let email = e.target.value
        // console.log(username)
        // let symbol = /[!@#$%^&*@]/
        let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // NOTE: !regex.test karna kita ingin format email sesuai dengan regex diatas
        // NOTE: berbanding terbalik dengan yang proteksi user
        if (!regex.test(email)) return this.setState({ emailValidErr: [true, "*Email format not valid"] })

        this.setState({ emailValidErr: [false, ""] })
    }


    render() {
        let { visible, visible_cp, userValidErr, emailValidErr, passValidErr, regError } = this.state
        if (this.state.signUpCon) return <Redirect to="/login" /> 
        console.log(this.state.dbUsers)
        console.log(this.state.signUpCon)
        return (
            <div style={styles.background}>
                <div style={styles.container}>
                    <h1 style={{ display: "flex", justifyContent: "center" }}>Register New Account</h1>
                    <p>Email</p>
                    <InputGroup className="mb-3">
                        <FormControl
                            ref="email"
                            placeholder="Email Username"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={(e) => this.emailValid(e)}
                        />
                        <InputGroup.Append>
                            <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                    <Form.Text style={{ color: "red" }}>
                        {emailValidErr[1]}
                    </Form.Text>
                    <p>Username</p>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                                <i class="fas fa-user"></i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            ref="username"
                            placeholder="Register New Username"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={(e) => this.userValid(e)}
                        />
                    </InputGroup>
                    <Form.Text style={{ color: "red" }}>
                        {userValidErr[1]}
                    </Form.Text>
                    <p>Password</p>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend style={{ cursor: 'pointer', width: '40px' }}
                            onClick={() => this.setState({ visible: !visible })}>
                            <InputGroup.Text id="basic-addon1">
                                <i class={visible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                {/* yang dibawah ini cara lebih panjangnya */}
                                {/* {visible ? <i class="fas fa-eye"></i> : <i class="fas fa-eye-slash"></i>} */}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            ref="password"
                            placeholder="Create password"
                            aria-label="password"
                            type={visible ? "text" : "password"}
                            aria-describedby="basic-addon1"
                            onChange={(e) => this.passValid(e)}
                        />
                    </InputGroup>
                    <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                        {passValidErr[1]}
                    </Form.Text>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend style={{ cursor: 'pointer', width: '40px' }}
                            onClick={() => this.setState({ visible_cp: !visible_cp })}>
                            <InputGroup.Text id="basic-addon1">
                                <i class={visible_cp ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                {/* yang dibawah ini cara lebih panjangnya */}
                                {/* {visible ? <i class="fas fa-eye"></i> : <i class="fas fa-eye-slash"></i>} */}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            ref="confirm_password"
                            placeholder="Confirm password"
                            aria-label="password"
                            type={visible_cp ? "text" : "password"}
                            aria-describedby="basic-addon1"

                        />
                    </InputGroup>
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: 'column' }}>
                        <p style={{ margin: '20px auto' }}>By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy.
                        You may receive SMS notifications from us and can opt out at any time</p>
                        <Button onClick={this.handleAdd} variant='primary' style={{ width: '100px', margin: 'auto' }}>Sign Up</Button>
                    </div>
                    <Modal show={regError[0]} onHide={() => this.setState({ regError: [false, ""] })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Error</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{regError[1]}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.setState({ regError: [false, ""] })}>
                                Okay
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}

const styles = {
    container: {
        margin: '200px auto',
        width: '800px',
        height: '70vh',
        background: 'rgba(82, 192, 192, 0.9)',
        padding: '10px',
        borderRadius: '15px'
    },
    item: {
        margin: '15px 0'
    },
    background: {
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        background: "url(https://images.unsplash.com/photo-1588392382834-a891154bca4d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80) no-repeat center",
        backgroundSize: '100vw 100vh'
    }
}