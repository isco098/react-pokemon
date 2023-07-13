import React, {useState} from 'react'

function BackToTop(props) {
    
    let btnScrollTop = props.btnScrollTop
    const backToTop = () =>{
        window.scrollTo({
        top: 0, 
        behavior: 'smooth'
        });
    };
    

    return (
        <div id="back-to-top-button" className={btnScrollTop ? '' : 'hide'} onClick={backToTop} >
            <i className="fas fa-arrow-up"></i>
        </div>
    )
}

export default BackToTop