import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
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
                            generateReport(item)
                        }}
                    >
                        <span>{item.identification}</span>
                        <span style={{ padding: '0 5px' }}>-</span>
                        <span>{item.name}</span>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}
