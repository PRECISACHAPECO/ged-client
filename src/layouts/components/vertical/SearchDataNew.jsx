import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'

const SearchDataNew = () => {
    const { menu, routes } = useContext(AuthContext)

    console.log('menu', menu)
    console.log('routes', routes)

    const hasPermission = (currentRoute, arrSubmenu = []) => {
        let response = false
        routes.forEach(permission => {
            if ((permission.rota === currentRoute && permission.ler) || arrSubmenu.length > 0) {
                response = true
            }
        })

        return response
    }

    const hasSubmenu = (currentRoute, arrSubmenu = []) => {
        let response = true
        if (!currentRoute) {
            response = false
            arrSubmenu.forEach(permission => {
                if (hasPermission(permission.rota)) response = true
            })
        }

        return response
    }

    const hasMenu = divider => {
        let response = false
        divider.menu.forEach(permission => {
            // Menu(s) com permissão
            if (hasPermission(permission.rota)) {
                response = true
            }

            // Submenu(s) com permissão (pelo menos 1)
            if (permission.submenu && permission.submenu.length > 0) {
                permission.submenu.forEach(permissionSub => {
                    routes.forEach(row => {
                        if (row.rota === permissionSub.rota && row.ler) response = true
                    })
                })
            }
        })

        return response
    }
    let data = []
    let category = ''
    for (const divisor of menu) {
        if (hasMenu(divisor)) {
            category = divisor.nome
            for (const item of divisor.menu) {
                if (hasPermission(item.rota)) {
                    data.push({
                        id: item.id,
                        url: item.rota,
                        icon: item.icone,
                        title: item.nome,
                        category: divisor.nome
                    })
                    // Mostra apenas se usuário tiver permissão de inserir
                    if (
                        routes.find(
                            row =>
                                row.rota === item.rota &&
                                row.inserir &&
                                row.rota !== '/formularios/fornecedor' &&
                                row.rota !== '/home'
                        )
                    ) {
                        data.push({
                            id: item.id,
                            url: `${item.rota}/novo`,
                            icon: item.icone,
                            title: `${item.nome} (Novo)`,
                            category: divisor.nome
                        })
                    }
                } else {
                    for (const subitem of item.submenu) {
                        if (hasPermission(subitem.rota)) {
                            data.push({
                                id: subitem.id,
                                url: subitem.rota,
                                icon: subitem.icone,
                                title: subitem.nome,
                                category: item.nome
                            })
                            // Mostra apenas se usuário tiver permissão de inserir
                            if (routes.find(row => row.rota === subitem.rota && row.inserir)) {
                                data.push({
                                    id: subitem.id,
                                    url: `${subitem.rota}/novo`,
                                    icon: subitem.icone,
                                    title: `${subitem.nome} (Novo)`,
                                    category: item.nome
                                })
                            }
                        }
                    }
                }
            }
        }
    }
    return data
}

export default SearchDataNew
