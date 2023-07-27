// Valida se o CNPJ é válido
function validationCNPJ(cnpj) {
    // Remove caracteres indesejados do CNPJ
    cnpj = cnpj.replace(/[^\d]+/g, '')

    // Valida a quantidade de dígitos do CNPJ
    if (cnpj.length !== 14) {

        return false
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpj)) {

        return false
    }

    // Algoritmo de validação do CNPJ
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    let digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--
        if (pos < 2) {
            pos = 9
        }
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)

    if (resultado != digitos.charAt(0)) {

        return false
    }

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--
        if (pos < 2) {
            pos = 9
        }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)

    if (resultado != digitos.charAt(1)) {

        return false
    }

    return true
}

// Valida se o CPF é válido
function validationCPF(cpf) {
    // Remove caracteres indesejados do CPF
    cpf = cpf.replace(/[^\d]+/g, '')

    // Valida a quantidade de dígitos do CPF
    if (cpf.length !== 11) {
        return false
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
        return false
    }

    // Algoritmo de validação do CPF
    let sum = 0
    let rest
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }
    rest = (sum * 10) % 11
    if ((rest === 10) || (rest === 11)) {
        rest = 0
    }
    if (rest !== parseInt(cpf.substring(9, 10))) {
        return false
    }
    sum = 0
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }
    rest = (sum * 10) % 11
    if ((rest === 10) || (rest === 11)) {
        rest = 0
    }
    if (rest !== parseInt(cpf.substring(10, 11))) {
        return false
    }

    return true
}


export { validationCNPJ, validationCPF }