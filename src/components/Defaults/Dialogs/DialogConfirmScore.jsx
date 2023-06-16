import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { api } from 'src/configs/api'
import { Grid, TextField, FormControl, Checkbox, Box, Switch, FormGroup, FormControlLabel } from '@mui/material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

const DialogConfirmScore = ({ openModal, setOpenModalConfirmScore, itemScore, setItemScore }) => {
    const handleClose = () => {
        setOpenModalConfirmScore(false)
    }

    const { handleSubmit, register } = useForm({})

    const onSubmit = values => {
        const data = {
            alternativaID: itemScore?.alternativaID,
            pontuacao: values?.pontuacao ? 1 : 0,
            parFornecedorBlocoItemID: itemScore?.parFornecedorBlocoItemID,
            alternatives: itemScore?.alternatives.map((item, index) => ({
                alternativaItemID: item?.alternativaItemID,
                score: values[item?.nome]
            }))
        }
        api.post(`/formularios/fornecedor/saveItemScore`, { data }).then(response => {
            setOpenModalConfirmScore(false)
            // getBlocks()
            toast.success('Pontuação salva com sucesso!')
        })
    }

    return (
        <>
            {itemScore?.alternatives && (
                <Dialog open={openModal} onClose={handleClose} aria-labelledby='form-dialog-title'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogTitle id='form-dialog-title'>Pontuação das respostas</DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{ mb: 3 }}>
                                Defina a pontuação para cada alternativa
                            </DialogContentText>
                            <Box sx={{ mb: 4 }}>
                                <FormGroup row>
                                    <FormControlLabel
                                        label='Habilitar pontuação'
                                        control={
                                            <Switch
                                                name={'pontuacao'}
                                                {...register('pontuacao')}
                                                checked={itemScore?.pontuacao == 1 ? true : false}
                                                onChange={e => {
                                                    setItemScore({
                                                        ...itemScore,
                                                        pontuacao: e.target.checked ? 1 : 0
                                                    })
                                                }}
                                            />
                                        }
                                    />
                                </FormGroup>
                            </Box>
                            {itemScore &&
                                itemScore?.alternatives.map((item, index) => (
                                    <Grid md={12} key={index} sx={{ mb: 4 }}>
                                        <grid item md={12}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    disabled={itemScore.pontuacao == 1 ? false : true}
                                                    id='outlined-basic'
                                                    label={item?.nome}
                                                    {...register(`${item?.nome}`)}
                                                    name={`${item?.nome}`}
                                                    defaultValue={item?.score}
                                                    variant='outlined'
                                                    size='small'
                                                    type='number'
                                                    title={
                                                        itemScore.pontuacao == 0
                                                            ? 'Habilite a pontuação para preencher'
                                                            : true
                                                    }
                                                />
                                            </FormControl>
                                        </grid>
                                    </Grid>
                                ))}
                        </DialogContent>
                        <DialogActions className='dialog-actions-dense'>
                            <Button
                                variant='outlined'
                                color='primary'
                                // startIcon={<Icon icon='material-symbols:cancel' />}
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                                // startIcon={<Icon icon='line-md:circle-to-confirm-circle-transition' />}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Confirmar
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            )}
        </>
    )
}

export default DialogConfirmScore
