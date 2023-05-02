import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'
import FormProfissao from 'src/components/Cadastros/Profissao/FormProfissao'

const ProfissaoForm = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Profissao')
    }, [])

    return <FormProfissao />
}

export default ProfissaoForm
