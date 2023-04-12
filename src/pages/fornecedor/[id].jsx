import FormFornecedor from 'src/components/Fornecedor/FormFornecedor'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const FornecedorForm = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Fornecedor')
    }, [])

    return <FormFornecedor />
}

export default FornecedorForm
