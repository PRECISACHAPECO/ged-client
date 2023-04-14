import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'
import FormApresentacao from 'src/components/Cadastros/Apresentacao/FormApresentacao'

const ApresentacaoNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Apresentação')
    }, [])

    return <FormApresentacao />
}

export default ApresentacaoNovo
