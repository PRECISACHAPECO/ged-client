import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'
import FormGrupoAnexos from 'src/components/Cadastros/grupoAnexos/FormGrupoAnexos'

const GrupoAnexosForm = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Grupo de anexos')
    }, [])

    return <FormGrupoAnexos />
}

GrupoAnexosForm.acl = {
    action: 'read',
    subject: 'acl-page'
}

export default GrupoAnexosForm
