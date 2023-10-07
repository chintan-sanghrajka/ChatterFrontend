import React from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()
    return (
        <div className='logout_div'>
            <button className='logout_button' onClick={() => {
                Cookies.remove('ChatterUser')
                Cookies.remove('ChatterToken')
                navigate('/login')
            }}>Logout</button>
        </div>
    )
}

export default Logout