import FormAtividade from 'src/components/Atividade/FormAtividade'
import { FormatContext } from 'src/context/FormatContext'
import { useContext, useEffect } from 'react'

const AtividadeForm = () => {
    const { setTitle } = useContext(FormatContext)

    useEffect(() => {
        setTitle('Atividade')
    }, [])

    return <FormAtividade />
}

export default AtividadeForm
