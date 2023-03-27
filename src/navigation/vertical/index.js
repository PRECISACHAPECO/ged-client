const navigation = () => {
    return [
        {
            title: 'Home',
            path: '/home',
            icon: 'mdi:home-outline',
        },
        {
            title: 'Second Page',
            path: '/second-page',
            icon: 'mdi:email-outline',
        },
        {
            path: '/acl',
            action: 'read',
            subject: 'acl-page',
            title: 'Access Control',
            icon: 'mdi:shield-outline',
        },
        {
            title: 'Cadastros',
            icon: 'mdi:home-outline',
            badgeContent: 'new',
            badgeColor: 'error',
            children: [
                {
                    title: 'Atividade',
                    path: '/cadastros/atividade',
                    action: 'read',
                },
                {
                    title: 'Item',
                    path: '/cadastros/item',
                    action: 'read',
                }
            ]
        },

        {
            title: 'Configurações',
            icon: 'mdi:home-outline',
            badgeContent: 'new',
            badgeColor: 'error',
            children: [
                {
                    title: 'Formulários',
                    path: '/configuracoes/formularios',
                    action: 'read',
                },
            ]
        },
    ]
}

export default navigation
