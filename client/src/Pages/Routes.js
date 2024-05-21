import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Auth/Login'
import Register from './Auth/Register'
import Home from './Home/Home'
import NoPage from './NoPage'
import User from './User/User'
import { useAuth } from '../context/Context'
import PrivateRoute from './Routes/PrivateRoute'
import AuthRoutes from './Routes/AuthRoutes'


export default function Index() {
    return (
        <>
            <Routes>
                <Route element={<AuthRoutes />}>
                    <Route path='/auth/'>
                        <Route path='login' element={<Login />} />
                        <Route path='register' element={<Register />} />
                    </Route>
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path='/' element={<Home />} />
                    {/* <Route path='/user' element={<User />} /> */}
                </Route>
                <Route path='/*' element={<NoPage />} />
            </Routes>
        </>
    )
}
