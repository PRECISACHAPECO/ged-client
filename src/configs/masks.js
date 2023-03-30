
// Mascara para CNPJ 
function cnpjMask(cnpj) {
    cnpj = cnpj.replace(/\D/g, '') // remove caracteres não numéricos
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2') // adiciona ponto após os dois primeiros dígitos
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // adiciona ponto após o terceiro dígito
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2') // adiciona barra após o quinto dígito
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2') // adiciona traço após o oitavo dígito

    return cnpj
}

// Mascara telefone celular
function cellPhoneMask(cellPhone) {
    cellPhone = cellPhone.replace(/\D/g, ''); // remove tudo que não é dígito
    cellPhone = cellPhone.replace(/^(\d{2})(\d)/g, '($1) $2'); // adiciona parênteses em volta dos dois primeiros dígitos
    cellPhone = cellPhone.replace(/(\d)(\d{4})$/, '$1-$2'); // adiciona hífen entre o quinto e o sexto dígitos
    // Remove o primeiro hífen após o código de área
    cellPhone = cellPhone.replace(/\)-/, ')');

    return cellPhone;
}

function cepMask(cep) {
    cep = cep.replace(/\D/g, '') // remove tudo que não é dígito
    cep = cep.replace(/^(\d{5})(\d)/, '$1-$2') // adiciona hífen após o quinto dígito

    return cep
}

function ufMask(uf) {
    uf = uf.toUpperCase(); // converte a string para letras maiúsculas
    uf = uf.replace(/[^A-Z]/g, ''); // remove todos os caracteres que não são letras
    
    return uf;
}

export { cnpjMask, cellPhoneMask, cepMask, ufMask }