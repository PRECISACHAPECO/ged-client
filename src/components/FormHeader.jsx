import Router from 'next/router'

import { CardContent, Button, Box } from '@mui/material'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import { backRoute } from 'src/configs/defaultConfigs'

const FormHeader = ({ btnCancel, btnSave, handleSubmit, btnDelete, onclickDelete }) => {
    const router = Router

    return (
        <>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                    {btnCancel && (
                        <Link href={backRoute(router.pathname)}>
                            <Button
                                type='button'
                                variant='outlined'
                                color='primary'
                                size='medium'
                                sx={{ mt: 2, mr: 2, py: 2 }}
                            >
                                <Icon icon='material-symbols:arrow-back-rounded' fontSize={20} />
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
                            sx={{ mt: 2, ml: 2 }}
                        >
                            Excluir
                        </Button>
                    )}
                </Box>

                <Box>
                    {btnSave && (
                        <Button
                            onClick={handleSubmit}
                            type='submit'
                            variant='outlined'
                            size='medium'
                            color='primary'
                            sx={{ mt: 2, mr: 2 }}
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
