import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Title from '../components/userComponents/Title.jsx';
import Cookies from 'js-cookie';

const PublicRoute = () => {
    const auth = Cookies.get('ChatterToken') || '';

    return (
        <>
            {
                !auth ?
                    <>
                        <Title />
                        <Outlet />
                    </>
                    : <Navigate to='/' />
            }
        </>
    )
}

export default PublicRoute
