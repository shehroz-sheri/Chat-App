import React from 'react'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom/dist'
import { useAuth } from '../../context/Context'

const PrivateRoute = () => {
    const auth = useAuth()
    const user = auth.isLoggedIn;

    return (
        user ? <Outlet /> : <Navigate to='/auth/login' />
    )
}

export default PrivateRoute