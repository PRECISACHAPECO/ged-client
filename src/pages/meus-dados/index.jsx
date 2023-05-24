// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import FormUnidade from 'src/components/Configuracoes/unidade/FormUnidade'

import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import { useContext, useEffect } from 'react'

const MeusDados = () => {
    const { setTitle } = useContext(ParametersContext)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        setTitle('Meus Dados')
    }, [])

    return <FormUnidade paramFornecedorUnidadeID={user.unidadeID} />
}

export default MeusDados
