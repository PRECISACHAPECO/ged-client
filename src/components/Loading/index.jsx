import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

<<<<<<< HEAD
const Loading = ({ title }) => {
=======
const Loading = () => {
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
    return (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%' }}>
            <CircularProgress />
<<<<<<< HEAD
            <p>{title ?? 'Carregando...'}</p>
=======
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
        </Box>
    )
}

export default Loading
