import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
<<<<<<< HEAD
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext } from 'react'
import LayoutReport from 'src/components/Reports/Layout'

export default function MenuReports({ disabled, dataReports, open, anchorEl, handleClick, handleClose }) {
=======
import React from 'react'

export default function MenuReports({
    disabled,
    generateReport,
    dataReports,
    open,
    anchorEl,
    handleClick,
    handleClose
}) {
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
    return (
        <div>
            <Menu
                id='fade-menu'
                MenuListProps={{
                    'aria-labelledby': 'fade-button'
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                {dataReports.map(item => (
                    <MenuItem
                        key={item.id}
                        onClick={() => {
                            handleClose()
                        }}
                    >
                        <span>{item.identification}</span>
                        <span style={{ padding: '0 5px' }}>-</span>
                        <LayoutReport title={item.name} content={item.component} />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}
