import FormAtividade from 'src/components/Atividade/FormAtividade'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const AtividadeForm = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Atividade')
    }, [])

    return <FormAtividade />
}

export default AtividadeForm
