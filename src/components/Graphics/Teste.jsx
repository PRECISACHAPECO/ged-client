import React from 'react'
import { api } from 'src/configs/api'

const App = () => {
    const handleGerarRelatorio = () => {
        const fornecedorID = 1
        const unidadeID = 1
        api.get(`/relatorio/fornecedor/?fornecedorID=${fornecedorID}&unidadeID=${unidadeID}`, {
            responseType: 'blob' // Define o tipo de resposta como um blob (arquivo)
        })
            .then(response => {
                const file = new Blob([response.data], { type: 'application/pdf' })
                const fileURL = URL.createObjectURL(file)
                window.open(fileURL) // Abre o arquivo em uma nova guia
            })
            .catch(error => {
                console.error('Erro ao gerar relatório:', error)
            })
    }

    return (
        <div>
            <button onClick={handleGerarRelatorio}>Gerar Relatório</button>
        </div>
    )
}

export default App
