// ** React Imports
import { useState, useContext } from 'react'

// ** Hooks
import { AuthContext } from 'src/context/AuthContext'

const DynamicMenu = () => {
    console.log('🚀 dINAMIFD    menu:')

    const { menu, routes } = useContext(AuthContext)

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

    const arrMenu = []
    for (const divisor of menu) {
        // Divider
        if (hasMenu(divisor)) {
            arrMenu.push({
                sectionTitle: divisor.nome
            })
        }

        // Menu e Submenu
        for (const item of divisor.menu) {
            if (hasPermission(item.rota, item.submenu) && hasSubmenu(item.rota, item.submenu)) {
                // Submenu
                const submenu = []
                if (item?.submenu && item.submenu.length > 0) {
                    for (const subitem of item.submenu) {
                        if (hasPermission(subitem.rota, [])) {
                            submenu.push({
                                title: subitem?.nome,
                                path: subitem?.rota,
                                icon: subitem?.icone,
                                badgeContent: subitem?.novo == 1 ? 'novo' : null,
                                badgeColor: subitem?.novo == 1 ? 'error' : null
                            })
                        }
                    }
                }

                // Monta menu com submenu (se houver)
                arrMenu.push({
                    title: item?.nome,
                    path: item?.rota,
                    icon: item?.icone,
                    badgeContent: item?.novo == 1 ? 'novo' : null,
                    badgeColor: item?.novo == 1 ? 'error' : null,
                    children: submenu.length > 0 ? submenu : null
                })
            }
        }
    }

    return arrMenu
}

export default DynamicMenu
