import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import SearchUser from './SearchUser.jsx'
import axios from 'axios';
import { BASE_URL } from '../helper.js';
import Logout from './Logout.jsx';

const UserComponent = ({ props }) => {

    const USER = JSON.parse(Cookies.get('ChatterUser'))
    const [connectionList, setConnectionList] = useState([])
    const [newUserAdded, setNewUserAdded] = useState(false)

    const getConnections = async () => {
        await axios.put(`${BASE_URL}get-connections`, {
            userId: USER._id,
        }).then((res) => {
            setConnectionList(res.data.connectionList)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getConnections()
    }, [newUserAdded])

    return (
        <div className={props.showUsers === true ? 'chat_people_list show_users_div' : 'chat_people_list'}>
            <h1 className='chat_title'>Chatter</h1>
            <SearchUser setNewUserAdded={setNewUserAdded} />
            <p className='chat_name mt-4'>Recent</p>
            <div className='display_person_outer_div'>
                {
                    connectionList.length !== 0 ?
                        connectionList.map((user, index) => {
                            const userName = user.userOneName === USER.userName ? user.userTwoName : user.userOneName;
                            const userId = user.userOneId === USER._id ? user.userTwoId : user.userOneId;
                            return <div key={index} className={user._id === props.selectedUser ? 'display_person_select_div display_person_div' : 'display_person_div'} onClick={() => {
                                props.setSelectedUser({ userId: userId, userName: userName })
                                props.setShowUsers(!props.showUsers)
                            }}>
                                <div className='person_avatar'>{userName[0]}</div>
                                <div className='ms-3'>
                                    <p className='chat_name'>{userName}</p>
                                </div>
                            </div>
                        }) :
                        <p className='no_chatter_para'>No Connections</p>
                }
            </div>
            <Logout />
        </div >
    )
}

export default UserComponent