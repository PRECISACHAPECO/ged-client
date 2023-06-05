
// ** Material UI
import { Typography } from '@mui/material'
import { formatDate } from './conversions'


// ** Next
import Link from 'next/link'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

import { useState, useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'

// ** API
import { api } from 'src/configs/api'
import axios from 'axios'

// Status Default
const statusDefault = {
    1: { title: 'Ativo', color: 'success' },
    0: { title: 'Inativo', color: 'secondary' },

    //* Status dos formulários do fornecedor
    10: { title: 'Pendente', color: 'warning' },
    20: { title: 'Acessou link', color: 'info' },
    30: { title: 'Em preenchimento', color: 'warning' },
    40: { title: 'Concluído', color: 'primary' },
    50: { title: 'Reprovado', color: 'error' },
    60: { title: 'Aprovado Parcial', color: 'warning' },
    70: { title: 'Aprovado', color: 'success' },
}

const configColumns = (currentLink, arrColumns) => {

    return arrColumns.map((column, i) => {
        const currentColumns = arrColumns[i].field

        return {
            ...column,
            flex: column.size,
            renderCell: params => (
                <Link href={`${currentLink}/${params.row.id}`}>
                    <Typography variant='body2' sx={{ color: 'text.primary' }}>
                        {arrColumns &&
                            arrColumns.map((c, j) => {
                                if (c.field === currentColumns) {
                                    // Encotrou a coluna
                                    if (c.field == 'status') {
                                        const status = statusDefault[params.row.status]

                                        return (
                                            <CustomChip
                                                key={j}
                                                size='small'
                                                skin='light'
                                                color={status.color}
                                                label={status.title}
                                                sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
                                            />
                                        )

                                    } else {
                                        return params.row[c.field]
                                    }
                                }
                            })}
                    </Typography>
                </Link >
            )
        }
    })
}

const toastMessage = {
    successNew: 'Dados salvos com sucesso!',
    successUpdate: 'Dados atualizados com sucesso!',
    errorNew: 'Erro ao salvar os dados!',
    errorRepeated: 'Dados já existentes!',
    errorUpdate: 'Erro ao atualizar os dados!',
    errorDelete: 'Erro ao excluir os dados!',
    successDelete: 'Dados excluídos com sucesso!',
    pendingDelete: 'Dado não pode ser excluido, pois já está sendo utilizado!',
    errorGet: 'Erro ao obter os dados!',
    successGet: 'Dados obtidos com sucesso!',
}

// Função que recebe uma rota, quebra pela barra e obtem a última parte da rota
const formType = (route) => {
    const arrRoute = route.split('/')
    const lastPart = arrRoute[arrRoute.length - 1]

    return lastPart == 'novo' ? 'new' : 'edit'
}

// Função que recebe uma rota, quebra pela / e remove a ultima parte, retornando a rota anterior
const backRoute = (route) => {
    const arrRoute = route.split('/')
    arrRoute.pop()

    return arrRoute.join('/')
}

// // Função pra gerar relatórios
const generateReport = props => {
    const route = props.route

    api.post(route, props.params, { responseType: 'arraybuffer' })
        .then(response => {
            // Converter o buffer do PDF em um objeto Blob
            const blob = new Blob([response.data], { type: 'application/pdf' })
            // Criar um objeto URL para o Blob

            const url = URL.createObjectURL(blob)
            // Abrir uma nova aba com o URL do relatório
            window.open(url, '_blank') // '_blank' abre em uma nova aba
        })
        .catch(error => {
            console.error('Erro ao gerar relatório', error)
        })
}
function dateConfig(type, date) {
    let currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    let inputDate = new Date(date);

    switch (type) {
        case 'atual':
            inputDate = new Date(date);
            inputDate.setUTCHours(0, 0, 0, 0);

            if (inputDate.toISOString().substr(0, 10) === currentDate.toISOString().substr(0, 10)) {
                return {
                    status: true,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                };
            } else {
                return {
                    status: false,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                    message: 'A data deve ser a data atual'
                };
            }

        case 'hoje_menor':
            inputDate = new Date(date);
            inputDate.setUTCHours(0, 0, 0, 0);

            if (inputDate.getTime() <= currentDate.getTime()) {
                return {
                    status: true,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                };
            } else {
                return {
                    status: false,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                    message: 'A data deve ser inferior ou igual a atual'
                };
            }

        case 'hoje_maior':
            inputDate = new Date(date);
            inputDate.setUTCHours(0, 0, 0, 0);

            if (inputDate.getTime() >= currentDate.getTime()) {
                return {
                    status: true,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                };
            } else {
                return {
                    status: false,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                    message: 'A data deve ser superior ou igual a atual'
                };
            }

        case 'hoje_menor_ate_1':
            inputDate = new Date(date);
            inputDate.setUTCHours(0, 0, 0, 0);

            let oneYearLater = new Date();
            oneYearLater.setUTCHours(0, 0, 0, 0);
            oneYearLater.setFullYear(currentDate.getFullYear() + 1);

            if (inputDate.getTime() <= currentDate.getTime() && inputDate.getTime() <= oneYearLater.getTime()) {
                return {
                    status: true,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                };
            } else {
                return {
                    status: false,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                    message: 'A data deve ser igual ou supeior até 1 ano a partir da data atual'
                };
            }

        case 'hoje_menor_ate_10':
            inputDate = new Date(date);
            inputDate.setUTCHours(0, 0, 0, 0);

            let tenYearsLater = new Date();
            tenYearsLater.setUTCHours(0, 0, 0, 0);
            tenYearsLater.setFullYear(currentDate.getFullYear() + 10);

            if (inputDate.getTime() <= currentDate.getTime() && inputDate.getTime() <= tenYearsLater.getTime()) {
                return {
                    status: true,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                };
            } else {
                return {
                    status: false,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                    message: 'A data deve ser igual ou supeior até 10 anos a partir da data atual'
                };
            }

        case 'hoje_menor_ate_100':
            inputDate = new Date(date);
            inputDate.setUTCHours(0, 0, 0, 0);

            let hundredYearsLater = new Date();
            hundredYearsLater.setUTCHours(0, 0, 0, 0);
            hundredYearsLater.setFullYear(currentDate.getFullYear() + 100);

            if (inputDate.getTime() <= currentDate.getTime() && inputDate.getTime() <= hundredYearsLater.getTime()) {
                return {
                    status: true,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                };
            } else {
                return {
                    status: false,
                    dataIni: currentDate.toISOString().substr(0, 10),
                    dataFim: currentDate.toISOString().substr(0, 10),
                    message: 'A data deve ser igual ou supeior até 100 anos a partir da data atual'
                };
            }
        default:
            return "A data digitada é inválida.";
    }
}


export { configColumns, formType, backRoute, statusDefault, toastMessage, generateReport, dateConfig }