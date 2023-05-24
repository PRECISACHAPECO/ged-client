// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const searchData = [
    {
        id: 1,
        url: '/pop01/fornecedor',
        icon: 'mdi:chart-donut',
        title: 'Início',
        category: 'Geral'
    },

]

// ** GET Search Data
mock.onGet('/app-bar/search').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()

    const exactData = {
        Geral: [],
        Fornecedor: [],
        Cadastros: [],
        Configurações: [],
        Definições: [],
    }

    const includeData = {
        Geral: [],
        Fornecedor: [],
        Cadastros: [],
        Configurações: [],
        Definições: [],
    }
    searchData.forEach(obj => {
        const isMatched = obj.title.toLowerCase().startsWith(queryLowered)
        if (isMatched && exactData[obj.category].length < 5) {
            exactData[obj.category].push(obj)
        }
    })
    searchData.forEach(obj => {
        const isMatched =
            !obj.title.toLowerCase().startsWith(queryLowered) && obj.title.toLowerCase().includes(queryLowered)
        if (isMatched && includeData[obj.category].length < 5) {
            includeData[obj.category].push(obj)
        }
    })
    const categoriesCheck = []
    Object.keys(exactData).forEach(category => {
        if (exactData[category].length > 0) {
            categoriesCheck.push(category)
        }
    })
    if (categoriesCheck.length === 0) {
        Object.keys(includeData).forEach(category => {
            if (includeData[category].length > 0) {
                categoriesCheck.push(category)
            }
        })
    }
    const resultsLength = categoriesCheck.length === 1 ? 5 : 3
    console.log("🚀 resultsLength:", resultsLength)

    return [
        200,
        [
            ...exactData.Geral.concat(includeData.Geral).slice(0, resultsLength),
            ...exactData.Fornecedor.concat(includeData.Fornecedor).slice(0, resultsLength),
            ...exactData.Cadastros.concat(includeData.Cadastros).slice(0, resultsLength),
            ...exactData.Configurações.concat(includeData.Configurações).slice(0, resultsLength),
            ...exactData.Definições.concat(includeData.Definições).slice(0, resultsLength),
        ]
    ]
})
