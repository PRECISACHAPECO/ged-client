// ** React Imports
import { useState, useContext } from 'react'

// ** Hooks
import { AuthContext } from 'src/context/AuthContext'

const defaultSuggestionsData = () => {
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

    const defaultSuggestionsData = [];
    let title = ''
    for (const divisor of menu) {
        // Divider
        if (hasMenu(divisor)) { // 3x
            title = divisor.nome
            let arrMenu = []
            for (const item of divisor.menu) {
                // Menu
                if (hasPermission(item.rota)) {
                    arrMenu.push({
                        icon: 'eva:arrow-right-outline',
                        suggestion: item.nome,
                        link: item.rota
                    })
                }
                else {
                    // virar titulo
                    if (arrMenu.length > 0) {
                        defaultSuggestionsData.push({
                            category: title,
                            suggestions: arrMenu
                        });
                    }

                    title = item.nome
                    arrMenu = []
                }

                // Submenu
                if (item.submenu && item.submenu.length > 0) {
                    for (const subitem of item.submenu) {
                        if (hasPermission(subitem.rota)) {
                            arrMenu.push({
                                icon: 'eva:arrow-right-outline',
                                suggestion: subitem.nome,
                                link: subitem.rota
                            })
                        }
                    }
                }
            }

            if (arrMenu.length > 0) {
                defaultSuggestionsData.push({
                    category: title,
                    suggestions: arrMenu
                });
            }
        }
    }

    return defaultSuggestionsData
}

export default defaultSuggestionsData
