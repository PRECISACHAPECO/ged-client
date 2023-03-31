import FormCadastro from 'src/components/Atividade/FormAtividade'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const AtividadeNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Atividade')
    }, [])

    return <FormCadastro />
}

export default AtividadeNovo
