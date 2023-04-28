// ** React Imports
import { useState, useContext } from 'react'

// ** Hooks
import { AuthContext } from 'src/context/AuthContext'

const DynamicMenu = () => {
    const { menu, routes } = useContext(AuthContext)

    const arrMenu = routes.map(route => {
        return {
            title: route.title,
            path: route.path,
            icon: route.icon,
            badgeContent: route.badgeContent,
            badgeColor: route.badgeColor
        }
    })

    console.log('🚀 ~ Menu: arrMenu:', menu)
    console.log('🚀 ~ Menu: routes:', routes)

    return [
        {
            title: 'Fornecedor',
            path: '/fornecedor',
            icon: 'mdi:truck-fast-outline',
            badgeContent: 'novo',
            badgeColor: 'error'
        },

        {
            title: 'Recebimento MP',
            path: '/recebimento-mp',
            icon: 'icon-park-outline:receive'
        },

        {
            title: 'Não conformidade',
            path: '/',
            icon: 'mdi:warning-circle-outline'
        },

        {
            sectionTitle: 'Definições'
        },

        {
            title: 'Cadastros',
            icon: 'ph:note-pencil',
            action: 'read',
            subject: 'acl-page',

            // badgeContent: 'novo',
            // badgeColor: 'error',
            children: [
                {
                    icon: 'fluent:food-grains-24-regular',
                    title: 'Atividade',
                    path: '/cadastros/atividade',
                    action: 'read'
                },
                {
                    icon: 'fluent:row-triple-24-regular',
                    title: 'Item',
                    path: '/cadastros/item',
                    action: 'read',
                    subject: 'acl-page'
                },
                {
                    icon: 'ic:baseline-content-paste-search',
                    title: 'Sistema de Qualidade',
                    path: '/cadastros/sistema-qualidade',
                    action: 'read'
                },
                {
                    icon: 'mdi:dump-truck',
                    title: 'Tipo de Veículo',
                    path: '/cadastros/tipo-veiculo',
                    action: 'read'
                },
                {
                    icon: 'mdi:transportation',
                    title: 'Transportador',
                    path: '/cadastros/transportador',
                    action: 'read'
                },
                {
                    icon: 'mdi:transportation',
                    title: 'Produtos',
                    path: '/cadastros/produtos',
                    action: 'read',
                    subject: 'acl-page'
                },
                {
                    icon: 'mdi:transportation',
                    title: 'Apresentação',
                    path: '/cadastros/apresentacao',
                    action: 'read'
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
                    action: 'read'
                },
                {
                    icon: 'mdi:farm-outline',
                    title: 'Unidade',
                    path: '/configuracoes/unidade',
                    action: 'read'
                },
                {
                    icon: 'mdi:user-circle-outline',
                    title: 'Usuário',
                    path: '/configuracoes/usuario',
                    action: 'read'
                }
            ]
        }
    ]
}

export default DynamicMenu
