import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import React from 'react'
import Icon from 'src/@core/components/icon'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Box } from '@mui/material'

export default function MenuReports({ disabled, handleClickGenerateReport, dataReports }) {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div>
            <Button
                id='fade-button'
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color='primary'
                disabled={disabled}
                variant='outlined'
                size='medium'
                type='button'
                startIcon={<Icon icon='material-symbols:print' />}
            >
                Imprimir
            </Button>
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
                            handleClickGenerateReport(item)
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
