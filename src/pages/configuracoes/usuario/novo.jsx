import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'
import FormUsuario from 'src/components/Configuracoes/Usuario/FormUsuario'

const UsuarioNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Usuário')
    }, [])

    return <FormUsuario />
}

export default UsuarioNovo
