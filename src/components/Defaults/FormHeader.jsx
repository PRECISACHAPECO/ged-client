import Router from 'next/router'
import { useState, useContext } from 'react'

import { CardContent, Button, Box } from '@mui/material'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import { backRoute } from 'src/configs/defaultConfigs'
import MenuReports from './MenuReports'
import { AuthContext } from 'src/context/AuthContext'

const FormHeader = ({
    btnCancel,
    btnSave,
    handleSubmit,
    btnDelete,
    onclickDelete,
    btnPrint,
    disabled,
    generateReport,
    dataReports
}) => {
    const router = Router
    const { routes } = useContext(AuthContext)
    const dynamicRoute = router.pathname.split('/').slice(0, -1).join('/')
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                    {btnCancel && (
                        <Link href={backRoute(router.pathname)}>
                            <Button type='button' variant='outlined' color='primary' size='medium'>
                                <Icon icon='material-symbols:arrow-back-rounded' />
                            </Button>
                        </Link>
                    )}

                    {btnDelete && routes.find(route => route.rota === dynamicRoute && route.excluir) && (
                        <Button
                            type='button'
                            onClick={onclickDelete}
                            variant='outlined'
                            color='error'
                            size='medium'
                            startIcon={<Icon icon='material-symbols:delete-outline' />}
                        >
                            Excluir
                        </Button>
                    )}
                </Box>

                <Box sx={{ display: 'flex', gap: '8px' }}>
                    {/* Imprimir com 1 opção */}
                    {btnPrint && dataReports.length === 1 && (
                        <Button
                            id='fade-button'
                            aria-controls={open ? 'fade-menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={open ? 'true' : undefined}
                            onClick={() => generateReport(dataReports[0])}
                            color='primary'
                            disabled={disabled}
                            variant='outlined'
                            size='medium'
                            type='button'
                            startIcon={<Icon icon='material-symbols:print' />}
                        >
                            Imprimir
                        </Button>
                    )}
                    {/* Imprimir com +1 opção (dropdown) */}
                    {btnPrint && dataReports.length > 1 && (
                        <>
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
                            <MenuReports
                                generateReport={generateReport}
                                dataReports={dataReports}
                                handleClick={handleClick}
                                handleClose={handleClose}
                                open={open}
                                anchorEl={anchorEl}
                            />
                        </>
                    )}

                    {btnSave && routes.find(route => route.rota === dynamicRoute && route.editar) && (
                        <Button
                            onClick={handleSubmit}
                            type='submit'
                            variant='outlined'
                            size='medium'
                            color='primary'
                            disabled={disabled}
                            startIcon={<Icon icon='material-symbols:save' />}
                        >
                            Salvar
                        </Button>
                    )}
                </Box>
            </CardContent>
        </>
    )
}

export default FormHeader
