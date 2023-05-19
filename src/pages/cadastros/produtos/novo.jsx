import FormProdutos from 'src/components/Cadastros/Produtos/FormProdutos'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const TransportadorNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Produto')
    }, [])

    return <FormProdutos />
}

TransportadorNovo.acl = {
    action: 'read',
    subject: 'acl-page'
}

export default TransportadorNovo
