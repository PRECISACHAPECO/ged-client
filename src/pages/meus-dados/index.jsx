// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import FormUnidade from 'src/components/Configuracoes/unidade/FormUnidade'

import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const MeusDados = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Home')
    }, [])

    return <FormUnidade paramFornecedorUnidadeID={1} />
}

export default MeusDados
