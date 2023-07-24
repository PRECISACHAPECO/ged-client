import { api } from 'src/configs/api'
import { useEffect, useState } from 'react'

const getData = params => {
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            await api
                .post('relatorio/fornecedor/dadosFornecedor', { data: params })
                .then(response => setData(response.data))
        }
        fetchData()
    }, [params])
    return data
}

export default getData
