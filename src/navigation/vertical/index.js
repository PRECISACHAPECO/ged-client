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
                    title: 'Analytics',
                    path: '/dashboards/analytics'
                },
                {
                    title: 'eCommerce',
                    path: '/dashboards/ecommerce'
                }
            ]
        },
    ]
}

export default navigation
