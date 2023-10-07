import React, { useState, useEffect } from 'react'
import InputTags from '../InputTags.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../helper.js'
import ProgressBar from './../ProgressBar.jsx'
import Cookies from 'js-cookie'

const LoginPage = () => {
    const [data, setData] = useState({})
    const navigate = useNavigate()
    const [noUsername, setNoUsername] = useState(false)
    const [invalidUsername, setInvalidUsername] = useState(false)
    const [noPassword, setNoPassword] = useState(false)
    const [invalidPassword, setInvalidPassword] = useState(false)
    const [loadingWidth, setLoadingWidth] = useState("0")
    const [progress, setProgress] = useState(true)

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    useEffect(() => {
        setProgress(true)
    }, [data])

    const submitHandler = () => {
        setNoUsername(false)
        setNoPassword(false)
        setInvalidUsername(false)
        setInvalidPassword(false)
        if (data.username === undefined || data.username === "") {
            setNoUsername(true)
        }
        else if (data.password === undefined || data.password === "") {
            setNoPassword(true)
        }
        else if (data.username !== undefined && data.password !== undefined) {
            setLoadingWidth("70%")
            axios.post(`${BASE_URL}login`, { userName: data.username, password: data.password }
            ).then((res) => {
                if (res.data.status === 3) {
                    setInvalidUsername(true)
                    setLoadingWidth("0")
                    setProgress(false)
                }
                if (res.data.status === 4) {
                    setInvalidPassword(true)
                    setLoadingWidth("0")
                    setProgress(false)
                }
                if (res.data.status === 5) {
                    setLoadingWidth("0")
                    setProgress(false)
                    Cookies.set('ChatterUser', JSON.stringify(res.data.user), { expires: 1 })
                    Cookies.set('ChatterToken', res.data.token, { expires: 1 })
                    navigate('/chat-page')
                }
            }).catch((err) => {
                console.log(err)
                setProgress(false)
            })
        }
    }
    return (
        <>
            {progress && <ProgressBar loadingWidth={loadingWidth} />}
            <div className='form_div'>
                <InputTags props={{ type: "text", name: "username", placeholder: "Username", heading: "Username", changeHandler: onChangeHandler }} />
                {noUsername && <p className='error_msg'>Please enter username</p>}
                {invalidUsername && <p className='error_msg'>Invalid Username</p>}
                <InputTags props={{ type: "password", name: "password", placeholder: "Password", heading: "Password", changeHandler: onChangeHandler }} />
                {noPassword && <p className='error_msg'>Please enter password</p>}
                {invalidPassword && <p className='error_msg'>Invalid Password</p>}

                <button className='button_filled_large' onClick={submitHandler}><i className="bi bi-box-arrow-in-right me-2"></i>Login</button>
                <p className='form_signup_para'>Don't have an account? <span className='form_signup' onClick={() => navigate('/signup')}>Signup.</span></p>
            </div>
        </>

    )
}

export default LoginPage