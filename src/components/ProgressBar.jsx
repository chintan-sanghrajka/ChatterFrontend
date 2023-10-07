import React from 'react'

const ProgressBar = (props) => {
    return (
        <>
            <div className='loading_bar' style={{ width: `${props.loadingWidth}` }}></div>
        </>
    )
}

export default ProgressBar