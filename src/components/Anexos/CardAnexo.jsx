import { Box, Button, Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useRef, useContext, useState, useEffect } from 'react'
import { SettingsContext } from 'src/@core/context/settingsContext'
import IconCloudUpload from 'src/icon/IconUpload'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const CardAnexo = ({ grupo, indexGrupo, handleFileSelect, handleRemoveAnexo }) => {
    const [selectedItem, setSelectedItem] = useState(null)

    const { settings } = useContext(SettingsContext)
    const mode = settings.mode

    const fileInputRef = useRef(null)

    const handleAvatarClick = item => {
        fileInputRef.current.click()
        setSelectedItem(item)
    }

    useEffect(() => {
        fileInputRef.current.value = ''
    }, [handleFileSelect])

    return (
        <Card sx={{ mt: 4 }}>
            <CardContent>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                    {grupo.nome}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                    {grupo.descricao}
                </Typography>
                <Grid container spacing={4}>
                    {grupo.itens.map((item, indexItem) => (
                        <Grid item xs={12} md={3} key={`${indexGrupo}-${indexItem}`}>
                            <div
                                className={`border hover:border-[#4A8B57] transition-colors  ${
                                    mode === 'dark' ? 'border-[#71717B]' : 'border-[#E1E1E6]'
                                } rounded-lg flex flex-col relative z-10`}
                            >
                                <div
                                    className={`flex items-center justify-center border-b p-1 ${
                                        mode === 'dark' ? 'border-[#71717B]' : 'border-[#E1E1E6]'
                                    }`}
                                >
                                    <p>{item.nome}</p>
                                </div>
                                <div
                                    className='flex justify-center items-center cursor-pointer p-1 h-[150px] w-full'
                                    onClick={() => handleAvatarClick(item)}
                                >
                                    {item.anexo && item.anexo.exist ? (
                                        // Versão com pdf preview
                                        // <div className='bg-red-500 h-full w-full'>
                                        //     <Document file={item?.anexo?.path}>
                                        //         <Page pageNumber={1} renderMode='pdf' />
                                        //     </Document>
                                        // </div>
                                        // Versao antiga
                                        <div
                                            className={`flex p-2 w-full items-center justify-between gap-2 rounded-lg`}
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
                                                    onClick={() => handleRemoveAnexo(item)}
                                                >
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <IconCloudUpload className='w-20 h-20' />
                                        </div>
                                    )}
                                </div>
                                <div className='flex items-center justify-between gap-1 p-1'>
                                    <p className='text-xs opacity-70'>{item.descricao}</p>
                                    <Tooltip
                                        title={
                                            item.hasPending == 1
                                                ? `Este item não pode mais ser removido pois já foi respondido em um formulário`
                                                : `Remover este item`
                                        }
                                    >
                                        <IconButton
                                            color='error'
                                            onClick={() => handleRemoveAnexo(item)}
                                            disabled={!item.anexo?.exist}
                                        >
                                            <Icon icon='tabler:trash-filled' />
                                        </IconButton>
                                    </Tooltip>
                                </div>
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
