import FormUnidade from 'src/components/Configuracoes/unidade/FormUnidade'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const UnidadeNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Unidade')
    }, [])

    return <FormUnidade />
}

export default UnidadeNovo
