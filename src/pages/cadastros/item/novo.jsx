import FormCadastro from 'src/components/Atividade/FormAtividade'
import { FormatContext } from 'src/context/FormatContext'
import { useContext, useEffect } from 'react'

const ItemNovo = () => {
    const { setTitle } = useContext(FormatContext)

    useEffect(() => {
        setTitle('Item')
    }, [])

    return <FormCadastro />
}

export default ItemNovo
