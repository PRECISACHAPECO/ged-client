import Router from 'next/router'

import FormParametrosFornecedor from 'src/components/Configuracoes/Formularios/Fornecedor/FormParametrosFornecedor'

const FormulariosForm = () => {
    const id = Router.query.id
    
    return (
        <>
            {id == 1 && <FormParametrosFornecedor />}
            {!id && <div>Formulário não encontrado</div>}
        </>
    )
}

export default FormulariosForm
