import React from 'react'

const Loader = () => {
    return (
        <div className="d-flex justify-content-center overflow-hidden">
            <div className="spinner-border" style={{ position: "absolute", width: "3rem", height: "3rem", top: "45%", left: "50%", color: '#25316D' }}
                role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Loader