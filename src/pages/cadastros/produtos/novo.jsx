import FormProdutos from 'src/components/Cadastros/Produtos/FormProdutos'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const TransportadorNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Produtos')
    }, [])

    return <FormProdutos />
}

export default TransportadorNovo
