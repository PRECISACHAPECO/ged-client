
// ** Material UI
import { Typography } from '@mui/material'

// ** Next
import Link from 'next/link'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** API
import { api } from 'src/configs/api'

// Status Default
const statusDefault = {
    1: { title: 'Ativo', color: 'success' },
    0: { title: 'Inativo', color: 'secondary' },

    // Status do s formulários
    10: { title: 'Pendente', color: 'warning' },
    20: { title: 'Acessou o link', color: 'warning' },
    30: { title: 'Em preenchimento', color: 'warning' },
    40: { title: 'Fornecedor concluiu preenchimento', color: 'warning' },
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
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    <Link href={`${currentLink}/${params.row.id}`}>
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
                    </Link>
                </Typography>
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

// Função pra gerar relatórios
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

export { configColumns, formType, backRoute, statusDefault, toastMessage, generateReport }

