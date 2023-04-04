import FormFornecedor from 'src/components/Pop01/Fornecedor/FormFornecedor'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const FornecedorNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Fornecedor')
    }, [])

    return <FormFornecedor />
}

export default FornecedorNovo
