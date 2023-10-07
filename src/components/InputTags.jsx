import React from 'react';

const InputTags = (props) => {

    return (
        <>
            <p className='form_label'>{props.props.heading}</p>
            <input type={props.props.type} name={props.props.name} placeholder={props.props.placeholder}
                className='form_input' onChange={props.props.changeHandler} value={props.props.value} />
        </>
    );
}

export default InputTags;