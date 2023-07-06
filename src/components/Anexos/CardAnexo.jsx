import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useRef, useContext, useState, useEffect } from 'react'
import { SettingsContext } from 'src/@core/context/settingsContext'
import IconCloudUpload from 'src/icon/IconUpload'
import IconFilePdf from '../../icon/IconPdf'

const CardAnexo = ({ grupo, indexGrupo, handleFileSelect, handleRemoveAnexo }) => {
    const [selectedItem, setSelectedItem] = useState(null)
    console.log('🚀 ~ selectedItem:', selectedItem)

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
                                className={`border  ${
                                    mode === 'dark' ? 'border-[#71717B]' : 'border-[#E1E1E6]'
                                } rounded-lg flex flex-col relative z-10`}
                            >
                                <div className={`flex items-center justify-center p-2 mt-1 `}>
                                    <p className='font-medium'>{item.nome}</p>
                                </div>
                                <div
                                    className='flex justify-center items-center cursor-pointer p-1 h-[150px] w-full '
                                    onClick={() => {
                                        item.anexo && item.anexo.path && item.anexo.exist
                                            ? window.open(item.anexo.path, '_blank')
                                            : handleAvatarClick(item)
                                    }}
                                >
                                    <div
                                        className={`flex p-2  justify-center items-center gap-2 rounded-lg w-full h-full m-3 border border-dashed hover:border-[#4A8B57] transition-colors ${
                                            mode === 'dark'
                                                ? ' border-[rgba(234, 234, 255, 0.10)]'
                                                : 'rgba(76, 78, 100, 0.12)'
                                        }`}
                                    >
                                        <div className='flex items-center gap-3'>
                                            {item.anexo && item.anexo.exist ? (
                                                <div>
                                                    <div className='flex items-center gap-2'>
                                                        {/* <p className='text-5xl'>PDF</p> */}
                                                        <IconFilePdf className='text-6xl fill-red-500' />
                                                        {/* <img
                                                            width={22}
                                                            height={22}
                                                            alt='invoice.pdf'
                                                            src='/images/icons/file-icons/pdf.png'
                                                        />
                                                        <Typography variant='body2'>{`${item.anexo.nome} (${(
                                                            item.anexo.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}mb)`}</Typography> */}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='flex flex-col items-center gap-1'>
                                                    <IconCloudUpload
                                                        className={`w-20 h-20 ${
                                                            item.anexo && item.anexo.exist
                                                                ? 'fill-[#666CFF]'
                                                                : 'fill-current'
                                                        }`}
                                                    />
                                                    <h6 className='text-sm font-normal opacity-80'>
                                                        Adicione um arquivo
                                                    </h6>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between gap-1 p-2 py-3 pl-4'>
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
