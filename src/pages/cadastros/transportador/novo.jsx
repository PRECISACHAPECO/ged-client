import FormTransportador from 'src/components/Cadastros/Transportador/FormTransportador'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const TransportadorNovo = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Transportador')
    }, [])

    return <FormTransportador />
}

export default TransportadorNovo
