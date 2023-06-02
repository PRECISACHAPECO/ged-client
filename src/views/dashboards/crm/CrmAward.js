// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useContext, useState } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import { ParametersContext } from 'src/context/ParametersContext'
import Link from 'next/link'
import ReactDOMServer from 'react-dom/server';
import Fornecedor from 'src/pages/relatorio/formularios/fornecedor'

// Styled component for the trophy image
const TrophyImg = styled('img')(({ theme }) => ({
    right: 22,
    bottom: 0,
    width: 106,
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
        width: 95
    }
}))

const CrmAward = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const { generateReport } = useContext(ParametersContext)


    async function baixarPdf() {
        const componenteHTML = ReactDOMServer.renderToString(<Fornecedor />);

        fetch('https://demo.gedagro.com.br/api/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ componenteHTML })
        })
            .then(response => {
                if (response.ok) {
                    // PDF criado com sucesso, faça o download do PDF
                    window.location.href = 'https://demo.gedagro.com.br/api/pdf/download';
                } else {
                    console.error('Erro ao criar o PDF');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    const gerarPdf = () => {
        const generateReport = async () => {
            try {
                const response = await fetch('https://demo.gedagro.com.br/api/pdf/gerar', {
                    method: 'POST',
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                } else {
                    console.error('Failed to generate report');
                }
            } catch (error) {
                console.error('Error generating report:', error);
            }
        };
        generateReport();
    }



    return (
        <Card sx={{ position: 'relative' }}>
            <CardContent>
                <Typography variant='h6'>
                    Bem-vindo{' '}
                    <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {user.nome}
                    </Box>
                    !
                </Typography>
                <Typography variant='body2' sx={{ mb: 3.25 }}>
                    {loggedUnity.nomeFantasia}
                </Typography>
                <Typography variant='h5' sx={{ fontWeight: 600, color: 'primary.main' }}>
                    $42.8k
                </Typography>
                <Typography variant='body2' sx={{ mb: 3.25 }}>
                    78% of target 🤟🏻
                </Typography>
                <Button size='small' variant='contained' onClick={baixarPdf}>
                    Baixar Pdf
                </Button>
                <Button size='small' variant='contained' onClick={gerarPdf}>
                    Gerar Pdf
                </Button>
                <TrophyImg alt='trophy' src='/images/cards/trophy.png' />
            </CardContent>
        </Card>
    )
}

export default CrmAward
