import React from 'react'
import { api } from 'src/configs/api'

function Report() {
    const openReport = async () => {
        try {
            // const response = await fetch('http://localhost:3333/api/report')
            const response = await fetch('https://demo.gedagro.com.br/api/report')

            const blob = await response.blob()
            const url = URL.createObjectURL(blob)

            // Abrir o relatório em uma nova guia do navegador
            window.open(url, '_blank')
        } catch (error) {
            console.error('Erro ao abrir o relatório:', error)
        }
    }

    return (
        <div>
            <button onClick={openReport}>Abrir Relatório</button>
        </div>
    )
}

export default Report
