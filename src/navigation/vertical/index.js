const navigation = () => {
    return [
        {
            title: 'Home',
            path: '/home',
            icon: 'material-symbols:home-outline-rounded',
        },

        {
            sectionTitle: 'Formulários'
        },

        {
            title: 'Fornecedor',
            path: '/fornecedor',
            icon: 'mdi:truck-fast-outline',
            badgeContent: 'novo',
            badgeColor: 'error',
        },

        {
            title: 'Recebimento MP',
            path: '/',
            icon: 'icon-park-outline:receive',
        },

        {
            title: 'Não conformidade',
            path: '/',
            icon: 'mdi:warning-circle-outline',
        },

        {
            sectionTitle: 'Definições'
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
                },
                {
                    icon: 'ic:baseline-content-paste-search',
                    title: 'Sistema de Qualidade',
                    path: '/cadastros/sistema-qualidade',
                    action: 'read',
                },
                {
                    icon: 'mdi:dump-truck',
                    title: 'Tipo de Veículo',
                    path: '/cadastros/tipo-veiculo',
                    action: 'read',
                },
                {
                    icon: 'mdi:transportation',
                    title: 'Transportador',
                    path: '/cadastros/transportador',
                    action: 'read',
                },
                {
                    icon: 'mdi:transportation',
                    title: 'Produtos',
                    path: '/cadastros/produtos',
                    action: 'read',
                },
                {
                    icon: 'mdi:transportation',
                    title: 'Apresentação',
                    path: '/cadastros/apresentacao',
                    action: 'read',
                },
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
