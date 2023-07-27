const defaultSuggestionsData = [
    {
        category: 'Principais buscas',
        suggestions: [
            {
                icon: 'mdi:chart-donut',
                suggestion: 'Fornecedor',
                link: '/pop01/fornecedor/'
            },
            {
                icon: 'mdi:poll',
                suggestion: 'Unidade',
                link: '/configuracoes/unidade/'
            },
            {
                icon: 'mdi:chart-bubble',
                suggestion: 'Formularios',
                link: 'configuracoes/formularios/'
            },
            {
                icon: 'mdi:account-group',
                suggestion: 'User List',
                link: '/apps/user/list'
            }
        ]
    },
    {
        category: 'Cadastros',
        suggestions: [
            {
                icon: 'mdi:calendar-blank',
                suggestion: 'Atividade',
                link: '/cadastros/atividade'
            },
            {
                icon: 'mdi:format-list-numbered',
                suggestion: 'Item',
                link: '/cadastros/item'
            },
            {
                icon: 'mdi:currency-usd',
                suggestion: 'Sistema de Qualidade',
                link: '/cadastros/sistema-qualidade'
            },
            {
                icon: 'mdi:account-cog-outline',
                suggestion: 'Account Settings',
                link: '/pages/account-settings/account'
            }
        ]
    },
    {
        category: 'Configurações',
        suggestions: [
            {
                icon: 'mdi:format-text-variant-outline',
                suggestion: 'Formularios',
                link: '/configuracoes/formularios'
            },
            {
                icon: 'mdi:tab',
                suggestion: 'Tabs',
                link: '/components/tabs'
            },
            {
                icon: 'mdi:gesture-tap-button',
                suggestion: 'Buttons',
                link: '/components/buttons'
            },
            {
                icon: 'mdi:card-bulleted-settings-outline',
                suggestion: 'Advanced Cards',
                link: '/ui/cards/advanced'
            }
        ]
    },
    {
        category: 'Formularios',
        suggestions: [
            {
                icon: 'mdi:format-list-checkbox',
                suggestion: 'Fornecedor',
                link: '/pop01/fornecedor'
            },
            {
                icon: 'mdi:lastpass',
                suggestion: 'Autocomplete',
                link: '/forms/form-elements/autocomplete'
            },
            {
                icon: 'mdi:view-grid-outline',
                suggestion: 'Table',
                link: '/tables/mui'
            },
            {
                icon: 'mdi:calendar-range',
                suggestion: 'Date Pickers',
                link: '/forms/form-elements/pickers'
            }
        ]
    }
]

export default defaultSuggestionsData