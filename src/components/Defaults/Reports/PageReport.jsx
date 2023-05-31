import React from 'react'
import ButtonsReport from './ButtonsReport'

const PageReport = ({ children }) => {
    return (
        <div>
            <ButtonsReport />
            {/* <HeaderReport/> */}
            {children}
        </div>
    )
}

export default PageReport
