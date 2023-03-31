import FormCadastro from 'src/components/Atividade/FormAtividade'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const ItemNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Item')
    }, [])

    return <FormCadastro />
}

export default ItemNovo
