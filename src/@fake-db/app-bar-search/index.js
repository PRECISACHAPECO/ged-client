// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const searchData = [
  // Categoria Fornecedor
  {
    id: 1,
    url: '/pop01/fornecedor',
    icon: 'mdi:chart-donut',
    title: 'Fornecedor',
    category: 'Fornecedor'
  },
  {
    id: 2,
    url: '/pop01/fornecedor/novo',
    icon: 'mdi:chart-donut',
    title: 'Fornecedor Novo',
    category: 'Fornecedor'
  },


  // Categoria Cadastros
  {
    id: 100,
    url: '/cadastros/atividade',
    icon: 'mdi:chart-donut',
    title: 'Atividade',
    category: 'Cadastros'
  },
  {
    id: 101,
    url: '/cadastros/atividade/novo',
    icon: 'mdi:chart-donut',
    title: 'Atividade Novo',
    category: 'Cadastros'
  },

  {
    id: 151,
    url: '/cadastros/item',
    icon: 'mdi:chart-donut',
    title: 'Item',
    category: 'Cadastros'
  },
  {
    id: 152,
    url: '/cadastros/item/novo',
    icon: 'mdi:chart-donut',
    title: 'Item Novo',
    category: 'Cadastros'
  },
  {
    id: 153,
    url: '/cadastros/sistema-qualidade',
    icon: 'mdi:chart-donut',
    title: 'Sistema de Qualidade',
    category: 'Cadastros'
  },
  {
    id: 154,
    url: '/cadastros/sistema-qualidade/novo',
    icon: 'mdi:chart-donut',
    title: 'Sistema de Qualidade Novo',
    category: 'Cadastros'
  },


  // Categoria Configurações
  {
    id: 200,
    url: '/configuracoes/formularios',
    icon: 'mdi:chart-donut',
    title: 'Formulários',
    category: 'Configurações'
  },
  {
    id: 201,
    url: '/configuracoes/unidade',
    icon: 'mdi:chart-donut',
    title: 'Unidade',
    category: 'Configurações'
  },
  {
    id: 202,
    url: '/configuracoes/unidade/novo',
    icon: 'mdi:chart-donut',
    title: 'Unidade Novo',
    category: 'Configurações'
  },

]

// ** GET Search Data
mock.onGet('/app-bar/search').reply(config => {
  const { q = '' } = config.params
  const queryLowered = q.toLowerCase()

  const exactData = {
    Fornecedor: [],
    Cadastros: [],
    Configurações: [],
  }

  const includeData = {
    Fornecedor: [],
    Cadastros: [],
    Configurações: [],
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

  return [
    200,
    [
      ...exactData.Fornecedor.concat(includeData.Fornecedor).slice(0, resultsLength),
      ...exactData.Cadastros.concat(includeData.Cadastros).slice(0, resultsLength),
      ...exactData.Configurações.concat(includeData.Configurações).slice(0, resultsLength),

    ]
  ]
})
