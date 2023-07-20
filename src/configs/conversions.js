import moment from 'moment'
import md5 from 'crypto-js/md5';

// Função que converte a data para o formato brasileiro
function formatDate(date, format) {
    const data = moment(date)
    const dataFormatada = data.format(format)

    return dataFormatada
}


function criptoMd5(value) {
    const hash = md5(value).toString()
    return hash
}

function onlyNumber(value) {
    return value.replace(/[^0-9]/g, ''); // Remove caracteres especiais e letras
}

export { formatDate, criptoMd5, onlyNumber }