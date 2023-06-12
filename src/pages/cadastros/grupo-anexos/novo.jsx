import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'
import FormGrupoAnexos from 'src/components/Cadastros/grupoAnexos/FormGrupoAnexos'

const GrupoAnexosNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Grupo de Anexos')
    }, [])

    return <FormGrupoAnexos />
}

GrupoAnexosNovo.acl = {
    action: 'read',
    subject: 'acl-page'
}

export default GrupoAnexosNovo
