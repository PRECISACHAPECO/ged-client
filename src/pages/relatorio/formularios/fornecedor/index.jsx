import { useEffect, useState } from 'react'
import Head from 'next/head'
import { api } from 'src/configs/api'
import { Divider, Grid, Typography } from '@mui/material'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

import React from 'react'

const Fornecedor = ({ data }) => {
    const [fields, setFields] = useState(null)
    const [atividades, setAtividades] = useState(null)
    const [sistemaQualidade, setSistemaQualidade] = useState(null)
    const [blocos, setBlocos] = useState(null)

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.post('/relatorio/fornecedor/', data)
                setFields(response.data.fields)
                setAtividades(response.data.atividades)
                setSistemaQualidade(response.data.sistemaQualidade)
                setBlocos(response.data.blocos)
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

    const CustomDivider = () => {
        return (
            <hr
                style={{
                    margin: 0,
                    border: 0,
                    borderTop: '1px solid rgba(0, 0, 0, 0.2)',
                    margin: '0 auto'
                }}
            />
        )
    }

    return (
        <div>
            <div className='container'>
                <Head>
                    <title className='no-print'>GED</title>
                </Head>
                {isLoading ? (
                    <div style={{ paddingBottom: '10px' }}>Carregando dados...</div>
                ) : (
                    fields && (
                        <>
                            <div className='content'>
                                <div>
                                    <Typography variant='h5' align='center' sx={{ mt: 4, mb: 12, fontWeight: 'bold' }}>
                                        QUESTIONÁRIO DE AUTO AVALIAÇÃO DO FORNECEDOR
                                    </Typography>

                                    <Divider component={CustomDivider} />
                                    <Grid container spacing={3} sx={{ pt: 2 }}>
                                        {fields.map((row, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <Grid item xs={4}>
                                                        <Typography variant='caption'>{row.title}</Typography>
                                                        <Typography variant='subtitle1'>{row.value ?? '--'}</Typography>
                                                    </Grid>
                                                    {(index + 1) % 3 === 0 && index < fields.length - 1 && (
                                                        <Grid item xs={12}>
                                                            <Divider component={CustomDivider} />
                                                        </Grid>
                                                    )}
                                                </React.Fragment>
                                            )
                                        })}
                                    </Grid>
                                    <Divider component={CustomDivider} />
                                    <Grid container spacing={3} sx={{ pt: 2 }}>
                                        <Grid item xs={12}>
                                            <Typography variant='caption'>
                                                Categoria(s): <Typography variant='subtitle1'>{atividades}</Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='caption'>
                                                Atividade(s): <Typography variant='subtitle1'>{atividades}</Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='caption'>
                                                Sistema(s) de Qualidade:{' '}
                                                <Typography variant='subtitle1'>{sistemaQualidade}</Typography>
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {blocos.map((bloco, index) => (
                                        <Table key={index} className='table-auto w-full mt-4'>
                                            <TableHead>
                                                <TableRow className='bg-gray-100 border'>
                                                    <TableCell>{bloco.nome}</TableCell>
                                                    <TableCell>Resposta</TableCell>
                                                    <TableCell>Observações</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {bloco.itens.map((item, itemIndex) => (
                                                    <TableRow key={itemIndex}>
                                                        <TableCell className='border -'>
                                                            <span className='opacity-80'>{item.ordem} - </span>
                                                            {item.nome}
                                                        </TableCell>
                                                        <TableCell className='border '>
                                                            {item.resposta ? item.resposta : ''}
                                                        </TableCell>
                                                        <TableCell className='border '>
                                                            {item.obsResposta ? item.obsResposta : ''}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ))}
                                    <p className='w-2/5 mx-auto mt-20 border-t border-gray-500 text-center'>
                                        Assinatura do profissional
                                    </p>
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>
            <style jsx>{`
                .content {
                    padding: 20px;
                }
                .container {
                    padding: 5px 0;
                    width: 50%;
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
                        background-color: transparent;
                        box-shadow: none;
                    }
                    .time-container {
                        display: none !important;
                    }
                    .content {
                        padding: 0px;
                    }
                }
            `}</style>
        </div>
    )
}

export default Fornecedor
