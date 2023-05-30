import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
// import VerticalNavItems from 'src/navigation/vertical'
import VerticalNavItems from 'src/components/DynamicMenu' // Custom dynamic component for menu

import HorizontalNavItems from 'src/navigation/horizontal'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { AuthContext } from 'src/context/AuthContext'
import { useContext } from 'react'
import { Alert, Button, Icon, IconButton, Snackbar, Typography } from '@mui/material'

const UserLayout = ({ children, contentHeightFixed }) => {
    // ** Hooks
    const { settings, saveSettings } = useSettings()
    const { newVersionAvailable, setNewVersionAvailable, setOpenModalUpdate, openModalUpdate } = useContext(AuthContext)
    const currentVersion = localStorage.getItem('latestVersion')

    // ** Vars for server side navigation
    // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
    // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()
    /**
     *  The below variable will hide the current layout menu at given screen size.
     *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
     *  You can change the screen size from which you want to hide the current layout menu.
     *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
     *  to know more about what values can be passed to this hook.
     *  ! Do not change this value unless you know what you are doing. It can break the template.
     */
    const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
    if (hidden && settings.layout === 'horizontal') {
        settings.layout = 'vertical'
    }

    const ClickUpdateAcept = () => {
        localStorage.setItem('latestVersion', newVersionAvailable.version)
        setNewVersionAvailable({ status: false, version: '' })
        window.location.reload()
    }

    const handleClose = () => {
        setOpenModalUpdate(false)
    };

    return (
        <Layout
            hidden={hidden}
            settings={settings}
            saveSettings={saveSettings}
            contentHeightFixed={contentHeightFixed}
            verticalLayoutProps={{
                navMenu: {
                    navItems: VerticalNavItems()

                    // Uncomment the below line when using server-side menu in vertical layout and comment the above line
                    // navItems: verticalMenuItems
                },
                appBar: {
                    content: props => (
                        <VerticalAppBarContent
                            hidden={hidden}
                            settings={settings}
                            saveSettings={saveSettings}
                            toggleNavVisibility={props.toggleNavVisibility}
                        />
                    )
                }
            }}
            {...(settings.layout === 'horizontal' && {
                horizontalLayoutProps: {
                    navMenu: {
                        navItems: HorizontalNavItems()

                        // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
                        // navItems: horizontalMenuItems
                    },
                    appBar: {
                        content: () => <HorizontalAppBarContent settings={settings} saveSettings={saveSettings} />
                    }
                }
            })}
        >
            <Typography className="no-print" variant='caption' style={{ position: "fixed", left: "35px", bottom: "15px", zIndex: "99999", color: "#6D788D" }}>v {currentVersion}</Typography>
            {children}

            {/* Versão do sistema */}

            {/* Mostra se tiver uma nova versão do sistema*/}
            {
                newVersionAvailable.status == true && (
                    <Snackbar
                        open={openModalUpdate}
                        onClose={handleClose}
                        autoHideDuration={null}
                    >
                        <Alert
                            sx={{ display: 'flex', alignItems: 'center', }}
                            elevation={3}
                            variant='filled'
                            onClose={handleClose}
                            severity='secondary'
                        >
                            Nova versão disponível, deseja atualizar para {newVersionAvailable.version} ?
                            <Button color="primary" variant='contained' size="small" onClick={ClickUpdateAcept} sx={{ ml: 4 }}>
                                Atualizar
                            </Button>
                        </Alert>
                    </Snackbar>
                )
            }
        </Layout>
    )
}

export default UserLayout
