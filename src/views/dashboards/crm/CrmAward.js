// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'

// Styled component for the trophy image
const TrophyImg = styled('img')(({ theme }) => ({
  right: 22,
  bottom: 0,
  width: 106,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 95
  }
}))

const CrmAward = () => {
  const { user } = useContext(AuthContext)


  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>
          Bem-vindo{' '}
          <Box component='span' sx={{ fontWeight: 'bold' }}>
            {user.nome}
          </Box>
          !
        </Typography>
        <Typography variant='body2' sx={{ mb: 3.25 }}>
          Best seller of the month
        </Typography>
        <Typography variant='h5' sx={{ fontWeight: 600, color: 'primary.main' }}>
          $42.8k
        </Typography>
        <Typography variant='body2' sx={{ mb: 3.25 }}>
          78% of target 🤟🏻
        </Typography>
        <Button size='small' variant='contained'>
          View Sales
        </Button>
        <TrophyImg alt='trophy' src='/images/cards/trophy.png' />
      </CardContent>
    </Card>
  )
}

export default CrmAward
