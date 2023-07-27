// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'


const Home = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Home')
    }, [])


    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="Home" />
                    <CardContent>
                        <Typography variant="body1">
                            lorem ipsum
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Home
