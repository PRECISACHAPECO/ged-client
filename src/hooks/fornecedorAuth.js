import { useContext } from 'react'
import { FornecedorContext } from 'src/context/FornecedorContext'

export const fornecedorAuth = () => useContext(FornecedorContext)
