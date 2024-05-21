import React, { createContext, useContext } from "react"
import Cookies from 'js-cookie'
import axios from "axios"
import { message } from "antd"
import { useNavigate } from "react-router-dom"



export const AuthContext = createContext()

export const AuthProvider = props => {
    const navigate = useNavigate()
    const token = Cookies.get('token')
    const user = JSON.parse(localStorage.getItem('user')) || token;
    const isLoggedIn = user ? true : false

    const URL = 'http://localhost:8000'

    const userLogin = user => {
        axios.post(`${URL}/user/login`, user)
            .then(res => {
                if (res.status === 200 && res.data.token) {
                    // Cookies.set('token', res.data.token, { expires: 1 })
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('user', JSON.stringify(res.data.user))

                    message.success(res.data.message)
                    return navigate('/')

                }
                // message.error(res.response.data)
            })
            .catch(err => {
                message.error(err.response.data)
            })


    }

    const userRegister = user => {
        axios.post(`${URL}/user/register`, user)
            .then(res => {
                if (res.status === 201 || res.data === 'User created successfully') {
                    message.success(res.data)
                    return navigate('/auth/login')

                }
                message.error(res.data)

            })
            .catch(err => {
                message.error(err.response.data + ' Email and Number should be unique')
            })
    }

    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')

        Cookies.remove('token')

        navigate('/auth/login')
    }


    return (
        <AuthContext.Provider value={{ isLoggedIn, userLogin, userRegister, URL, logout, user }}>
            {props.children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)