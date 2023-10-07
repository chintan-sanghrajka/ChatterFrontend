import { Outlet, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie';

const PrivateRoute = () => {
    const auth = Cookies.get('ChatterToken') || '';


    return (
        <>
            {
                auth ?
                    <>
                        <Outlet />
                    </>
                    : <Navigate to='/login' />
            }
        </>
    )
}

export default PrivateRoute
