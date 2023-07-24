import React from 'react'
import { Grid, Box, Button, Icon } from '@mui/material'

const FileInput = ({ xs, md, label, onChange }) => {
    const handleFileChange = event => {
        const file = event.target.files[0]
        // Fazer algo com o arquivo selecionado, como enviar ao servidor
        onChange(file)
    }

    return (
        <Grid item xs={xs} md={md}>
            <Box display='flex' flexDirection='column' alignItems='center' sx={{ my: 1 }}>
                <input
                    type='file'
                    accept='.jpg, .png, .pdf'
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id='fileInput'
                />
                <label htmlFor='fileInput'>
                    <Button
                        variant='contained'
                        component='span'
                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem', padding: '14px' }}
                        startIcon={<Icon icon='material-symbols:add-circle-outline-rounded' />}
                    >
                        {label}
                    </Button>
                </label>
            </Box>
        </Grid>
    )
}

export default FileInput
