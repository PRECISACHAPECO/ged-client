import { useEffect, useState } from 'react'
import Head from 'next/head'
import { api } from 'src/configs/api'
import { Grid } from '@mui/material'

const Fornecedor = ({ data }) => {
    const [reportData, setReportData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get('/report')
                setReportData(response.data)
                setIsLoading(false)
                console.log(response.data)
            } catch (error) {
                console.error(error)
                setIsLoading(false)
            }
        }

        getData()
    }, [])

    useEffect(() => {
        if (!isLoading) {
            // window.print()
        }
    }, [isLoading])

    return (
        <div className='main'>
            <div className='container'>
                <Head>
                    <title className='no-print'>.</title>
                </Head>
                <h1 style={{ textAlign: 'center' }}>Total de registros {reportData?.length}</h1>
                {isLoading ? (
                    <div style={{ paddingBottom: '10px' }}>Carregando dados...</div>
                ) : (
                    reportData && (
                        <div>
                            {reportData.map((item, index) => (
                                <Grid container key={index}>
                                    <Grid item xs={3}>
                                        <p>{item.nome}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p>{item.cpf}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p>{item.email}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p>{item.cnpj}</p>
                                    </Grid>
                                </Grid>
                            ))}
                        </div>
                    )
                )}
            </div>
            <style jsx>{`
                .main {
                }
                .container {
                    padding: 5px 0;
                    text-align: center;
                    width: 70%;
                    margin: 0 auto;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .no-print {
                    display: none;
                }
                @media print {
                    .container {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    )
}

export default Fornecedor
