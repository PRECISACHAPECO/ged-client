import Router from 'next/router'
import { useState, useContext, useEffect } from 'react'

import { CardContent, Button, Box } from '@mui/material'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import { backRoute } from 'src/configs/defaultConfigs'
import MenuReports from './MenuReports'
import { AuthContext } from 'src/context/AuthContext'
import { ParametersContext } from 'src/context/ParametersContext'
import Fab from '@mui/material/Fab'

const FormHeader = ({
    btnCancel,
    btnSave,
    btnSend,
    btnChangeStatus,
    handleSubmit,
    disabledSubmit,
    handleSend,
    disabledSend,
    handleChangeStatus,
    btnDelete,
    onclickDelete,
    btnPrint,
    disabled,
    dataReports
}) => {
    const router = Router
    const { user, routes } = useContext(AuthContext)
    const { generateReport } = useContext(ParametersContext)
    const [isVisible, setIsVisible] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const open = Boolean(anchorEl)
    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    //* Função remove /id (se houver) da rota caso seja dentro de um cadastro pra poder validar as rotas de permissao
    const getStaticRoute = () => {
        const route = router.pathname.split('/').slice(0, -1).join('/')
        return route ? route : router.pathname
    }

    const dynamicRoute = getStaticRoute()

    const dataButtons = [
        {
            id: 1,
            title: 'Imprimir',
            color: 'primary',
            size: 'large',
            variant: 'contained',
            icon: 'material-symbols:print',
            function: print
        },
        {
            id: 2,
            title: 'Voltar ao topo',
            color: 'primary',
            size: 'large',
            variant: 'outlined',
            icon: 'fluent:signature-24-filled',
            function: backToTop
        },
        {
            id: 3,
            title: 'Salvar PDF',
            color: 'primary',
            size: 'large',
            variant: 'outlined',
            icon: 'basil:download-solid',
            function: savePdf
        },
        {
            id: 4,
            title: 'Fechar',
            color: 'primary',
            size: 'large',
            variant: 'outlined',
            icon: 'ooui:close',
            function: closePage
        }
    ]

    //? Verifica se o usuário deu scroll na página e mostra o botão de salvar
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 0) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)

        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

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

                    {btnChangeStatus && (
                        <Button
                            type='button'
                            onClick={handleChangeStatus}
                            variant='outlined'
                            color='primary'
                            size='medium'
                            startIcon={<Icon icon='fluent:status-12-filled' />}
                        >
                            Status
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
                            disabled={disabled || disabledSubmit}
                            startIcon={<Icon icon='material-symbols:save' />}
                        >
                            Salvar
                        </Button>
                    )}

                    {/* Fornecedor concluir formulário e envia pra fábrica avaliar */}
                    {btnSend && user.papelID == 2 && (
                        <Button
                            onClick={handleSend}
                            type='button'
                            variant='contained'
                            size='medium'
                            color='primary'
                            disabled={disabled || disabledSend}
                            sx={{ ml: 2 }}
                            startIcon={<Icon icon='carbon:send-filled' />}
                        >
                            Enviar Formulário
                        </Button>
                    )}

                    {/* Botão flutuante de salvar (aparece quando o usuário dá scroll na página) */}

                    <div
                        className={`
                        ${isVisible ? 'fadeIn' : 'fadeOut'} fixed bottom-10 right-8 z-50
                    `}
                    >
                        {isVisible && btnSave && routes.find(route => route.rota === dynamicRoute && route.editar) && (
                            <div>
                                <Fab
                                    color='primary'
                                    size='large'
                                    onClick={handleSubmit}
                                    type='submit'
                                    variant='contained'
                                    disabled={disabled || disabledSubmit}
                                >
                                    <Icon icon='material-symbols:save' />
                                </Fab>
                            </div>
                        )}
                    </div>
                </Box>
            </CardContent>
        </>
    )
}

export default FormHeader
