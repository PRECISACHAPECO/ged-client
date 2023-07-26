import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import Table from 'src/components/Defaults/Table'
import FormFornecedor from 'src/components/Fornecedor/FormFornecedor'
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'
import { AuthContext } from 'src/context/AuthContext'
import DialogNewFornecedor from 'src/components/Defaults/Dialogs/DialogNewFornecedor'
import { validationEmail } from '../../../configs/validations'
import { toast } from 'react-hot-toast'

import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'

const Fornecedor = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle } = useContext(ParametersContext)
    const [open, setOpen] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false) //? Dependencia do useEffect pra atualizar listagem ao salvar
    const { id } = useContext(RouteContext)

    //* Controles modal pra inserir fornecedor
    const openModal = () => {
        setOpen(true)
    }

    const makeFornecedor = async (cnpj, gruposAnexo, email) => {
        console.log('🚀 ~ makeFornecedor => gruposAnexo:', gruposAnexo)

        try {
            setLoadingSave(true)
            await api
                .post(`${currentLink}/makeFornecedor`, {
                    usuarioID: user.usuarioID,
                    unidadeID: loggedUnity.unidadeID,
                    papelID: user.papelID,
                    cnpj: cnpj,
                    gruposAnexo: gruposAnexo
                })
                .then(response => {
                    if (response.status === 200) {
                        toast.success('Fornecedor habilitado com sucesso')
                        if (email) {
                            sendMail(email, cnpj)
                        }
                    } else {
                        toast.error('Erro ao tornar fornecedor')
                    }
                    setLoadingSave(false)
                })
        } catch (error) {
            console.log(error)
        }
    }

    const sendMail = (email, cnpj) => {
        if (email && validationEmail(email)) {
            const data = {
                unidadeID: loggedUnity.unidadeID,
                cnpj: cnpj,
                destinatario: email
            }
            api.post(`${currentLink}/sendMail`, { data })
                .then(response => {
                    toast.success('E-mail enviado com sucesso')
                })
                .catch(error => {
                    console.error('Erro ao enviar email', error)
                })
        }
    }

    //* Controles da listagem
    const getList = async () => {
        console.log('getList> ', currentLink)
        //
        await api
            .post(`${currentLink}/getList`, {
                unidadeID: loggedUnity.unidadeID,
                papelID: user.papelID,
                cnpj: user.cnpj ? user.cnpj : null
            })
            .then(response => {
                setResult(response.data)
                setTitle('Fornecedor')
            })
    }

    useEffect(() => {
        getList()
    }, [id, loadingSave])

    const arrColumns =
        user.papelID == 1
            ? [
                  {
                      headerName: 'ID',
                      field: 'id',
                      size: 1
                  },
                  {
                      headerName: 'Data da Avaliação',
                      field: 'data',
                      size: 1
                  },
                  {
                      headerName: 'Fornecedor',
                      field: 'fornecedor',
                      size: 1
                  },
                  {
                      headerName: 'CNPJ',
                      field: 'cnpj',
                      size: 1
                  },
                  {
                      headerName: 'Cidade',
                      field: 'cidade',
                      size: 1
                  },
                  {
                      headerName: 'Responsável',
                      field: 'responsavel',
                      size: 1
                  },
                  {
                      headerName: 'Status',
                      field: 'status',
                      size: 1
                  }
              ]
            : user.papelID == 2
            ? [
                  {
                      headerName: 'ID',
                      field: 'id',
                      size: 1
                  },
                  {
                      headerName: 'Data da Avaliação',
                      field: 'data',
                      size: 1
                  },
                  {
                      headerName: 'Fábrica',
                      field: 'fabrica',
                      size: 1
                  },
                  {
                      headerName: 'CNPJ',
                      field: 'cnpj',
                      size: 1
                  },
                  {
                      headerName: 'Cidade',
                      field: 'cidade',
                      size: 1
                  },
                  {
                      headerName: 'Responsável',
                      field: 'responsavel',
                      size: 1
                  },
                  {
                      headerName: 'Status',
                      field: 'status',
                      size: 1
                  }
              ]
            : []

    const columns = configColumns(currentLink, arrColumns)

    return (
        <>
            {/* Exibe loading enquanto não existe result */}
            {!result ? (
                <Loading />
            ) : //? Se tem id, exibe o formulário
            id && id > 0 ? (
                <FormFornecedor id={id} />
            ) : (
                //? Lista tabela de resultados da listagem
                <Table
                    result={result}
                    columns={columns}
                    btnNew={user.papelID == 1 ? true : false}
                    openModal={user.papelID == 1 ? openModal : null}
                />
            )}
            <DialogNewFornecedor
                openModal={open}
                handleClose={() => setOpen(false)}
                makeFornecedor={makeFornecedor}
                loadingSave={loadingSave}
            />
        </>
    )

    // return (
    //     <>
    //         {!result && <Loading />}
    //         {result && (
    //             <>
    //                 <Card>
    //                     <CardContent sx={{ pt: '0' }}>
    //                         <TableFilter
    //                             rows={result}
    //                             columns={columns}
    //                             buttonsHeader={{
    //                                 btnNew: user.papelID == 1 ? true : false,
    //                                 btnPrint: true,
    //                                 openModal: user.papelID == 1 ? openModal : null
    //                             }}
    //                         />
    //                     </CardContent>
    //                 </Card>
    //             </>
    //         )}
    //     </>
    // )
}

export default Fornecedor
