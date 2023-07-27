// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import { useContext, useState } from 'react'

import { toast } from 'react-hot-toast'

// ** Next Import
import { useRouter } from 'next/router'

// ** Components
import Autocomplete from 'src/layouts/components/vertical/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { Button, Typography } from '@mui/material'
import DialogSelectUnit from 'src/components/Defaults/Dialogs/DialogSelectUnit'

const notifications = [
    {
        meta: 'Today',
        avatarAlt: 'Flora',
        title: 'Congratulation Flora! 🎉',
        avatarImg: '/images/avatars/4.png',
        subtitle: 'Won the monthly best seller badge'
    },
    {
        meta: 'Yesterday',
        avatarColor: 'primary',
        subtitle: '5 hours ago',
        avatarText: 'Robert Austin',
        title: 'New user registered.'
    },
    {
        meta: '11 Aug',
        avatarAlt: 'message',
        title: 'New message received 👋🏻',
        avatarImg: '/images/avatars/5.png',
        subtitle: 'You have 10 unread messages'
    },
    {
        meta: '25 May',
        title: 'Paypal',
        avatarAlt: 'paypal',
        subtitle: 'Received Payment',
        avatarImg: '/images/misc/paypal.png'
    },
    {
        meta: '19 Mar',
        avatarAlt: 'order',
        title: 'Received Order 📦',
        avatarImg: '/images/avatars/3.png',
        subtitle: 'New order received from John'
    },
    {
        meta: '27 Dec',
        avatarAlt: 'chart',
        subtitle: '25 hrs ago',
        avatarImg: '/images/misc/chart.png',
        title: 'Finance report has been generated'
    }
]

const AppBarContent = props => {
    // ** Props
    const { hidden, settings, saveSettings, toggleNavVisibility } = props
    const { title } = useContext(ParametersContext)
    const { user, setLoggedUnity, loggedUnity, unitsUser, getRoutes, getMenu } = useContext(AuthContext)

    // ** Hooks
    const router = useRouter()

    // Controla troca de unidade
    const [openModal, setOpenModal] = useState(false);
    const [unity, setSelectedUnit] = useState(null);
    const handleCloseModalSelectUnits = () => setOpenModal(false);

    // Troca de unidade
    const handleConfirmUnity = () => {
        // Atualizar contexto e localStorage
        setLoggedUnity(unity)
        localStorage.setItem('loggedUnity', JSON.stringify(unity))

        getMenu(unity?.papelID)

        // Recebe usuário e unidade e seta rotas de acordo com o perfil
        getRoutes(user.usuarioID, unity?.unidadeID, user.admin, unity?.papelID)

        setOpenModal(false)
        router.replace('/home')
        toast.success('Unidade alterada com sucesso!')
    }

    return (
        <>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    {hidden && !settings.navHidden ? (
                        <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
                            <Icon icon='mdi:menu' />
                        </IconButton>
                    ) : null}
                    <Autocomplete hidden={hidden} settings={settings} />
                </Box>
                <Box className='app-title' sx={{ display: 'flex', alignItems: 'center' }}>
                    <h3>{title}</h3>
                </Box>
                <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
                    {
                        unitsUser && unitsUser.length > 1 ? (
                            <Button
                                color="secondary"
                                endIcon={<Icon icon='material-symbols:keyboard-arrow-down-rounded' />}
                                onClick={() => setOpenModal(true)}
                                style={{ textTransform: 'none' }}>
                                {loggedUnity?.nomeFantasia}
                            </Button>
                        ) : (
                            <Button
                                color="secondary"
                                style={{
                                    textTransform: 'none',
                                    pointerEvents: 'none'
                                }}>
                                {loggedUnity?.nomeFantasia}
                            </Button>
                        )
                    }

                    {/* <Typography variant='caption' sx={{ mr: 2 }}>{JSON.stringify(unitsUser)}</Typography> */}
                    <ModeToggler settings={settings} saveSettings={saveSettings} />
                    <NotificationDropdown settings={settings} notifications={notifications} />
                    <UserDropdown settings={settings} />
                </Box>
            </Box >

            <DialogSelectUnit
                openModal={openModal}
                handleClose={handleCloseModalSelectUnits}
                handleSubmit={handleConfirmUnity}
                unidades={unitsUser}
                setSelectedUnit={setSelectedUnit}
            />
        </>
    )
}

export default AppBarContent
