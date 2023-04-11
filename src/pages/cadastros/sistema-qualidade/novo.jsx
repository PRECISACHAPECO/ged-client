import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'
import FormSistemaQualidade from 'src/components/Cadastros/SistemaQualidade/FormSistemaQualidade'

const SistemaQualidadeNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Sistema de Qualidade')
    }, [])

    return <FormSistemaQualidade />
}

export default SistemaQualidadeNovo
