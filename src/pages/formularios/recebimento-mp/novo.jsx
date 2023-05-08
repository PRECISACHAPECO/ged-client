import FormRecebimentoMp from 'src/components/RecebimentoMp/FormRecebimentoMp'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const RecebimentoMpNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Recebimento de MP')
    }, [])

    return <FormRecebimentoMp />
}

export default RecebimentoMpNovo
