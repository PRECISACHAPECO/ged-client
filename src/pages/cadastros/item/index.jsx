import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import FormItem from 'src/components/Cadastros/Item/FormItem'
import Table from 'src/components/Defaults/Table'
import { ParametersContext } from 'src/context/ParametersContext'
<<<<<<< HEAD
import FormItem from 'src/components/Cadastros/Item/FormItem'

=======
import { RouteContext } from 'src/context/RouteContext'
>>>>>>> 775e144a93fcabce34b30f3c016004f6865b09b2
import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'

const Item = () => {
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle } = useContext(ParametersContext)
    const { id } = useContext(RouteContext)

    useEffect(() => {
        const getList = async () => {
            await api.get(currentLink).then(response => {
                setResult(response.data)
                setTitle('Item')
            })
        }
        getList()
    }, [id])

    const arrColumns = [
        {
            title: 'ID',
            field: 'id',
            size: 0.1
        },
        {
            title: 'Nome',
            field: 'nome',
            size: 0.6
        },
        {
            title: 'Formulário',
            field: 'formulario',
            size: 0.2
        },

        {
            title: 'Status',
            field: 'status',
            size: 0.1
        }
    ]

    const columns = configColumns(currentLink, arrColumns)

    return (
        <>
            {/* Exibe loading enquanto não existe result */}
            {!result ? (
                <Loading />
            ) : //? Se tem id, exibe o formulário
            id && id > 0 ? (
                <FormItem id={id} />
            ) : (
                //? Lista tabela de resultados da listagem
                <Table result={result} columns={columns} />
            )}
        </>
    )
}

Item.acl = {
    action: 'read',
    subject: 'acl-page'
}

export default Item
