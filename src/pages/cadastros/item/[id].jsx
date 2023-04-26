import FormItem from 'src/components/Cadastros/Item/FormItem'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const ItemForm = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Item')
    }, [])

    return <FormItem />
}

ItemForm.acl = {
    action: 'read',
    subject: 'acl-page'
}

export default ItemForm
