import Router from 'next/router'

import FormParametrosFornecedor from 'src/components/Configuracoes/Formularios/Fornecedor/FormParametrosFornecedor'
import FormParametrosRecebimentoMp from 'src/components/Configuracoes/Formularios/RecebimentoMp/FormParametrosRecebimentoMp'

const FormulariosForm = () => {
    const id = Router.query.id

    return (
        <>
            {id == 1 && <FormParametrosFornecedor />}
            {id == 2 && <FormParametrosRecebimentoMp />}
            {!id && <div>Formulário não encontrado</div>}
        </>
    )
}

export default FormulariosForm
