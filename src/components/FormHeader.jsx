import Router from 'next/router'

import { CardContent, Button, Box } from '@mui/material'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import { backRoute } from 'src/configs/defaultConfigs'
import MenuReports from './MenuReports'

const FormHeader = ({
    btnCancel,
    btnSave,
    handleSubmit,
    // handlePrint,
    btnDelete,
    onclickDelete,
    btnPrint,
    disabled,
    handleClickGenerateReport,
    dataReports
}) => {
    const router = Router

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

                    {btnDelete && (
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
                    {btnPrint && (
                        <MenuReports handleClickGenerateReport={handleClickGenerateReport} dataReports={dataReports} />
                    )}
                    {btnSave && (
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
