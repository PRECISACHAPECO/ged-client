import { useEffect } from 'react'

const Fornecedor = () => {
    useEffect(() => {
        window.print()
    }, [])
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Teste do fornecedor</h1>
        </div>
    )
}

export default Fornecedor
