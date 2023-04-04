const navigation = () => {
    return [
        {
            title: 'Home',
            path: '/home',
            icon: 'mdi:home-outline',
        },

        {
            title: 'POP-01',
            icon: 'material-symbols:filter-list-rounded',

            badgeContent: 'novo',
            badgeColor: 'error',
            children: [
                {
                    icon: 'mdi:truck-fast-outline',
                    title: 'Fornecedor',
                    path: '/pop01/fornecedor',
                    action: 'read',
                },
            ]
        },

        {
            title: 'Cadastros',
            icon: 'ph:note-pencil',

            // badgeContent: 'novo',
            // badgeColor: 'error',
            children: [
                {
                    icon: 'fluent:food-grains-24-regular',
                    title: 'Atividade',
                    path: '/cadastros/atividade',
                    action: 'read',
                },
                {
                    icon: 'fluent:row-triple-24-regular',
                    title: 'Item',
                    path: '/cadastros/item',
                    action: 'read',
                }
            ]
        },

        {
            title: 'Configurações',
            icon: 'ph:gear',
            // badgeContent: 'novo',
            // badgeColor: 'error',
            children: [
                {
                    icon: 'fluent:form-24-regular',
                    title: 'Formulários',
                    path: '/configuracoes/formularios',
                    action: 'read',
                },
                {
                    icon: 'mdi:farm-outline',
                    title: 'Unidade',
                    path: '/configuracoes/unidade',
                    action: 'read',
                },
            ]
        },
    ]
}

export default navigation
