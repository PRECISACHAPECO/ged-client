import FormUnidade from 'src/components/Configuracoes/unidade/FormUnidade'
import { FormatContext } from 'src/context/FormatContext'
import { useContext, useEffect } from 'react'

const UnidadeNovo = () => {
    const { setTitle } = useContext(FormatContext)

    useEffect(() => {
        setTitle('Unidade')
    }, [])

    return <FormUnidade />
}

export default UnidadeNovo
