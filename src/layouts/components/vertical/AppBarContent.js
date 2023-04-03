// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

import { ParametersContext } from 'src/context/ParametersContext'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'

const AppBarContent = props => {
    // ** Props
    const { hidden, settings, saveSettings, toggleNavVisibility } = props
    const { title } = useContext(ParametersContext)
    const { user } = useContext(AuthContext)

    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {hidden ? (
                    <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
                        <Icon icon='mdi:menu' />
                    </IconButton>
                ) : null}

                <ModeToggler settings={settings} saveSettings={saveSettings} />
            </Box>
            <Box>
                <h2 style={{ margin: "0px" }}>{title}</h2>

                {/* <small >{JSON.stringify(user)}</small> */}
            </Box>
            <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
                <UserDropdown settings={settings} />
            </Box>
        </Box>
    )
}

export default AppBarContent
