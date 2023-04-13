import FormTipoVeiculo from 'src/components/Cadastros/TipoVeiculo/FormTipoVeiculo'
import { ParametersContext } from 'src/context/ParametersContext'
import { useContext, useEffect } from 'react'

const TipoVeiculoForm = () => {
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Tipo de Veículo')
    }, [])

    return <FormTipoVeiculo />
}

export default TipoVeiculoForm
