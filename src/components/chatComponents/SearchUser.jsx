import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../helper.js'
import Cookies from 'js-cookie'

const SearchUser = ({ setNewUserAdded }) => {
    const [userSearch, setUserSearch] = useState('')
    const [searchUserList, setSearchUserList] = useState([])
    const [userList, setUserList] = useState([])
    const USER = JSON.parse(Cookies.get('ChatterUser'))

    const searchChangeHandler = (event) => {
        setUserSearch(event.target.value)
    }

    useEffect(() => {
        if (userSearch !== '') {
            getUsers()
        }
    }, [userSearch])

    const getUsers = async () => {
        await axios.post(`${BASE_URL}get-users`, {
            userSearch: userSearch,
        }).then((res) => {
            setSearchUserList(res.data.userList)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        const list = searchUserList.filter((user) => {
            return user.userName !== USER.userName
        })
        setUserList(list)
    }, [searchUserList])

    const newConnection = async (userId, userName) => {
        await axios.post(`${BASE_URL}new-connection`, {
            userOneId: USER._id,
            userOneName: USER.userName,
            userTwoId: userId,
            userTwoName: userName,
        }).then((res) => {
            setUserSearch('')
            setNewUserAdded(true)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className='find_chatter_div'>
            <input placeholder='Find A Chatter...' className='find_chatter_input' onChange={searchChangeHandler} value={userSearch} />
            {userSearch !== '' && <div className='find_chatter_userlist_div'>
                {userList.length !== 0 ? userList.map((user, index) => {
                    return <button className='find_chatter_user' key={index} onClick={() => newConnection(user._id, user.userName)}>{user.userName}</button>
                }) :
                    <p className='no_chatter_para'>No Chatters Found</p>
                }
            </div>}
        </div>
    )
}

export default SearchUser