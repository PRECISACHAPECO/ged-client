import FormUnidade from 'src/components/Configuracoes/unidade/FormUnidade'
import { FormatContext } from 'src/context/FormatContext'
import { useContext, useEffect } from 'react'

const UnidadeForm = () => {
    const { setTitle } = useContext(FormatContext)

    useEffect(() => {
        setTitle('Unidade')
    }, [])

    return <FormUnidade />
}

export default UnidadeForm
