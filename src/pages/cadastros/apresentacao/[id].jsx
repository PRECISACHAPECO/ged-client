import FormApresentacao from 'src/components/Cadastros/Apresentacao/FormApresentacao'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const ApresentacaoForm = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Apresentação')
    }, [])

    return <FormApresentacao />
}

export default ApresentacaoForm
