import FormCadastro from 'src/components/Atividade/FormAtividade'
import { FormatContext } from 'src/context/FormatContext'
import { useContext, useEffect } from 'react'

const AtividadeNovo = () => {
    const { setTitle } = useContext(FormatContext)

    useEffect(() => {
        setTitle('Atividade')
    }, [])

    return <FormCadastro />
}

export default AtividadeNovo
