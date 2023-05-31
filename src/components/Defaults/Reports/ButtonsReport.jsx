import Fab from '@mui/material/Fab'
import Icon from 'src/@core/components/icon'
import React from 'react'

const ButtonsReport = () => {
    const reportParameters = JSON.parse(localStorage.getItem('reportParameters'))

    const signature = () => {
        console.log('Assinatura eletronica')
    }

    const print = () => {
        window.print()
    }

    const savePdf = () => {
        console.log('savepdf', reportParameters)
    }

    const closePage = () => {
        window.close()
    }

    const dataButtons = [
        {
            id: 1,
            title: 'Imprimir',
            color: 'primary',
            size: 'large',
            variant: 'contained',
            icon: 'material-symbols:print',
            function: print
        },
        {
            id: 2,
            title: 'Assinar digitalmente',
            color: 'primary',
            size: 'large',
            variant: 'outlined',
            icon: 'fluent:signature-24-filled',
            function: signature
        },
        {
            id: 3,
            title: 'Salvar PDF',
            color: 'primary',
            size: 'large',
            variant: 'outlined',
            icon: 'basil:download-solid',
            function: savePdf
        },
        {
            id: 4,
            title: 'Fechar',
            color: 'primary',
            size: 'large',
            variant: 'outlined',
            icon: 'ooui:close',
            function: closePage
        }
    ]
    return (
        <div className='fixed bottom-10 right-8 flex flex-col-reverse gap-2 no-print '>
            {dataButtons &&
                dataButtons.map(item => (
                    <div key={item.id} style={{ textAlign: 'center' }} onClick={item.function}>
                        <Fab color={item.color} size={item.size} variant={item.variant}>
                            <Icon icon={item.icon} />
                        </Fab>
                    </div>
                ))}
        </div>
    )
}

export default ButtonsReport
