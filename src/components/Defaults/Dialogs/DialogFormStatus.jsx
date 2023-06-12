import { useEffect, useState, useContext, useCallback } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Icon from 'src/@core/components/icon'
import { api } from 'src/configs/api'
import { Alert, Autocomplete, Box, FormControl, TextField } from '@mui/material'
import { statusDefault } from 'src/configs/defaultConfigs'
import { AuthContext } from 'src/context/AuthContext'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

//? Timeline
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'
import DialogForm from './Dialog'

//? Styled Timeline component
const Timeline = styled(MuiTimeline)({
    paddingLeft: 0,
    paddingRight: 0,
    '& .MuiTimelineItem-root': {
        width: '100%',
        '&:before': {
            display: 'none'
        }
    }
})

const DialogFormStatus = ({
    id,
    parFormularioID,
    formStatus,
    hasFormPending,
    title,
    text,
    handleClose,
    openModal,
    handleSubmit,
    btnCancel,
    btnConfirm,
    canChangeStatus,
    btnConfirmColor
}) => {
    const [historic, setHistoric] = useState(false)
    const { user, loggedUnity } = useContext(AuthContext)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)

    console.log('selectedStatus: ', selectedStatus)

    const getMovementHistory = async () => {
        try {
            await api.post(`/formularios/fornecedor/getMovementHistory/${id}`, { parFormularioID }).then(response => {
                console.log('🚀 ~ response:', response.data)
                setHistoric(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    let arrStatus = []
    for (let key in statusDefault) {
        if (parseInt(key) == 30 && parseInt(key) != formStatus) {
            arrStatus.push({
                id: parseInt(key),
                nome: statusDefault[key].title
            })
        }
    }

    useEffect(() => {
        console.log('entrou no useeffect...')
        getMovementHistory()
    }, [openModalConfirm]) // Estado do modal de confirmação como dependência

    return (
        <>
            <Dialog open={openModal} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>{text}</DialogContentText>

                    {/* Altera status do formulário */}
                    {canChangeStatus && (
                        <Box>
                            <FormControl fullWidth>
                                <Autocomplete
                                    options={arrStatus}
                                    defaultValue={arrStatus.find(option => option.id === selectedStatus)}
                                    id='autocomplete-outlined'
                                    getOptionLabel={option => option.nome}
                                    onChange={(event, value) => {
                                        setSelectedStatus(value?.id)
                                    }}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            name={`formulario.status`}
                                            label='Alterar Status do Formulário'
                                            placeholder='Alterar Status do Formulário'
                                        />
                                    )}
                                />
                            </FormControl>
                        </Box>
                    )}

                    {/* Mensagem que não pode mais alterar pq já foi usado */}
                    {user && user.papelID == 1 && hasFormPending && (
                        <Alert severity='warning' sx={{ mb: 4 }}>
                            O Status não pode mais ser alterado pois já está sendo utilizado em outro formulário!
                        </Alert>
                    )}

                    {/* Lista timeline do histórico de movimentações do formulário */}
                    <Box>
                        <Timeline>
                            {historic &&
                                historic.length > 0 &&
                                historic.map((mov, index) => (
                                    <TimelineItem>
                                        <TimelineSeparator>
                                            <TimelineDot color={statusDefault[mov.statusAtual].color} />
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                                            <Box
                                                sx={{
                                                    mb: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Typography
                                                    variant='body2'
                                                    sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}
                                                >
                                                    {mov.data + ' - ' + mov.hora + ' '}
                                                    {index == 0 && (
                                                        <CustomChip
                                                            size='small'
                                                            skin='light'
                                                            color={statusDefault[mov.statusAtual].color}
                                                            label='Atual'
                                                            sx={{
                                                                '& .MuiChip-label': {
                                                                    textTransform: 'capitalize'
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Typography>
                                                <Typography variant='caption'>{mov.usuario}</Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    mb: 2,
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                                    <span>{statusDefault[mov.statusAnterior].title}</span>
                                                    <Icon
                                                        icon='mdi:arrow-right'
                                                        fontSize={20}
                                                        style={{ display: 'inline-block' }}
                                                    />
                                                    <span>{statusDefault[mov.statusAtual].title}</span>
                                                </Typography>
                                                <Typography variant='caption'>{mov.unidade}</Typography>
                                            </Box>
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                        </Timeline>
                    </Box>
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                    {btnCancel && (
                        <Button variant='outlined' color='primary' onClick={handleClose}>
                            Fechar
                        </Button>
                    )}
                    {btnConfirm && user && user.papelID == 1 && !hasFormPending && canChangeStatus && (
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={() => setOpenModalConfirm(true)}
                            disabled={!selectedStatus}
                        >
                            Confirmar
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Dialog de confirmação de envio */}
            <DialogForm
                openModal={openModalConfirm}
                handleClose={() => setOpenModalConfirm(false)}
                title='Confirmar Alteração'
                text={`Deseja realmente alterar o status do formulário para "${statusDefault[selectedStatus]?.title}" ? O mesmo ficará disponível para a edição do Fornecedor novamente.`}
                btnCancel
                btnConfirm
                btnConfirmColor='primary'
                handleSubmit={() => {
                    handleSubmit(selectedStatus), setOpenModalConfirm(false), setSelectedStatus(null)
                }}
            />
        </>
    )
}

export default DialogFormStatus
