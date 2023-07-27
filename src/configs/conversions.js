import moment from 'moment'

// Função que converte a data para o formato brasileiro
function formatDate(date, format) {
    const data = moment(date)
    const dataFormatada = data.format(format)
    
    return dataFormatada
}

export { formatDate }