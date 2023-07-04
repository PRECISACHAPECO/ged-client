import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { useRef, useContext, useState, useEffect } from 'react'
import { SettingsContext } from 'src/@core/context/settingsContext'

const CardAnexo = ({ grupo, indexGrupo, handleFileSelect, handleRemoveAnexo }) => {
    const [selectedItem, setSelectedItem] = useState(null)

    const { settings } = useContext(SettingsContext)
    const mode = settings.mode

    // Quando clicar no botão de foto, o input de foto é clicado abrindo o seletor de arquivos
    const fileInputRef = useRef(null)

    const handleAvatarClick = item => {
        fileInputRef.current.click()
        // setItemAnexoAux(item)
    }

    useEffect(() => {
        // Reset the file input element after each file selection
        fileInputRef.current.value = ''
        console.log('useEffect...')
    }, [handleFileSelect])

    return (
        <Card sx={{ mt: 4 }}>
            <CardContent>
                {/* {JSON.stringify(arrAnexo)} */}
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                    {grupo.nome}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                    {grupo.descricao}
                </Typography>
                {/* Itens do grupo */}
                <Grid container spacing={4}>
                    {grupo.itens.map((item, indexItem) => (
                        <Grid item xs={12} md={4} key={`${indexGrupo}-${indexItem}`}>
                            <div
                                className={`border hover:border-[#4A8B57] transition-colors ${
                                    mode === 'dark' ? 'border-[#71717B]' : 'border-[#E1E1E6]'
                                } rounded-lg p-6 pt-32 flex flex-col gap-6 relative z-10`}

                                // style={{
                                //     border: `${
                                //         mode == 'dark'
                                //             ? '1px solid rgba(234, 234, 255, 0.10)'
                                //             : '1px solid rgba(76, 78, 100, 0.12)'
                                //     }`,
                                //     borderRadius: '12px',
                                //     padding: '25px',
                                //     paddingTop: '120px',
                                //     display: 'flex',
                                //     flexDirection: 'column',
                                //     gap: '6px',
                                //     position: 'relative',
                                //     zIndex: 10
                                // }}
                            >
                                <div
                                    onClick={() => {
                                        handleAvatarClick(item)
                                        setSelectedItem(item)
                                    }}
                                    className='cursor-pointer '
                                >
                                    <img
                                        src='/images/storyset/a.svg'
                                        alt=''
                                        className='w-[20%] top-8 left-0 absolute'
                                    />
                                    <div>
                                        <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                                            {item.nome}
                                        </Typography>
                                        <Typography variant='body2' sx={{ mb: 2 }}>
                                            {item.descricao}
                                        </Typography>
                                    </div>
                                </div>
                                {/* Anexo */}
                                {item.anexo && item.anexo.exist && (
                                    <div
                                        className={`flex p-2 items-center justify-between gap-2 rounded-lg `}
                                        style={{
                                            border: `${
                                                mode == 'dark'
                                                    ? '1px dashed rgba(234, 234, 255, 0.10)'
                                                    : '1px dashed rgba(76, 78, 100, 0.12)'
                                            }`
                                        }}
                                    >
                                        <div className='flex gap-2 items-center'>
                                            <a
                                                href={item.anexo.path}
                                                target='_blank'
                                                className='flex gap-2 items-center'
                                            >
                                                <img
                                                    width={28}
                                                    height={28}
                                                    alt='invoice.pdf'
                                                    src='/images/icons/file-icons/pdf.png'
                                                />
                                                <Typography variant='body2'>{`${item.anexo.nome} (${(
                                                    item.anexo.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}mb)`}</Typography>
                                            </a>
                                        </div>
                                        <div
                                            style={{
                                                zIndex: 9999
                                            }}
                                        >
                                            <Button
                                                variant='outlined'
                                                size='small'
                                                onClick={() => handleRemoveAnexo(item.grupoanexoitemID)}
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type='file'
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={e => handleFileSelect(e, selectedItem)}
                                />
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default CardAnexo
