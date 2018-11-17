import React from 'react';

var RegularButton = (props) => {
    return (

        <button className="RegularButton" onClick={props.clickFunc} >

            {props.buttonText}

        </button>

    )
}

export default RegularButton;