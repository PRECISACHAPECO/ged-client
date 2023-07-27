import { api } from 'src/configs/api'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { useEffect } from 'react'

const StepBillingDetails = ({ handlePrev, dataGlobal, setDataGlobal }) => {

    const handleSubmit = () => {
        console.log(dataGlobal)
    }

    useEffect(() => {
        const endereco = {
            logradouro: dataGlobal?.usuario?.fields.logradouro,
            numero: dataGlobal?.usuario?.fields.numero,
            complemento: dataGlobal?.usuario?.fields.complemento,
            bairro: dataGlobal?.usuario?.fields.bairro,
            cidade: dataGlobal?.usuario?.fields.cidade,
            uf: dataGlobal?.usuario?.fields.uf
        }
        const enderecoCompleto = Object.entries(endereco).map(([key, value]) => {
            if (value) {
                return `${value}, `;
            }
        }).join('').slice(0, -2) + '.'; // Remove a última vírgula e adiciona um ponto final
        setDataGlobal({
            usuario: {
                ...dataGlobal?.usuario,
                fields: {
                    ...dataGlobal?.usuario?.fields,
                    enderecoCompleto: enderecoCompleto
                }
            }
        })
    }, [])

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <Typography variant='h5'>Verifique as informações</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Envie se estiver tudo certo</Typography>
            </Box>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography sx={{ color: 'text.primary' }}>CNPJ:</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.cnpj}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography sx={{ color: 'text.primary' }}>Nome Fantasia:</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.nomeFantasia}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography sx={{ color: 'text.primary' }}>Razão Social:</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.razaoSocial}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography sx={{ color: 'text.primary' }}>Email Institucional:</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography sx={{ color: 'text.primary' }}>Telefone:</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.telefone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography sx={{ color: 'text.primary' }}>Cep:</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.cep}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography sx={{ color: 'text.primary' }}>Endereço:</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.enderecoCompleto
                            }</Typography>
                        </Box>
                    </Box>

                    {/* Botoes de ação */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                        <Button
                            color='secondary'
                            variant='contained'
                            onClick={handlePrev}
                            startIcon={<Icon icon='mdi:chevron-left' fontSize={20} />}
                        >
                            Anterior
                        </Button>
                        <Button type='submit' onClick={handleSubmit} color='success' variant='contained'>
                            Enviar
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default StepBillingDetails
