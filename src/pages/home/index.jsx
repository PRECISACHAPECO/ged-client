// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import { useContext, useEffect } from 'react'
import Factory from 'src/components/Grapics/factory'
import Company from 'src/components/Graphics/Company'

const Home = () => {
    const { setTitle } = useContext(ParametersContext)
    const { user } = useContext(AuthContext)

    console.log(user)

    useEffect(() => {
        setTitle(user.papelID == 1 ? 'Home' : user.papelID == 2 ? 'Dashboard' : '')
    }, [])

    return user.papelID === 1 ? (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Company />
            </Grid>
        </Grid>
    ) : user.papelID === 2 ? (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Factory />
            </Grid>
        </Grid>
    ) : null
}

export default Home
