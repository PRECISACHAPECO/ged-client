// ** React Imports
import { createContext, use, useEffect, useState } from 'react'
import { api } from 'src/configs/api'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { toast } from 'react-hot-toast'

// ** Defaults
const defaultProvider = {
    user: null,
    loading: true,
    setUser: () => null,
    setLoading: () => Boolean,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
    // ** States
    const [user, setUser] = useState(defaultProvider.user)
    const [loading, setLoading] = useState(defaultProvider.loading)
    // Controlar unidades de seleção ao usuário logar no sistema
    const [openModalSelectUnits, setOpenModalSelectUnits] = useState(false)
    const [unitsUser, setUnitsUser] = useState([])
    const [loggedUnity, setLoggedUnity] = useState(null)
    const [userAux, setUserAux] = useState(null)
    const [currentRoute, setCurrentRoute] = useState('/login')
    // Rotas 
    const [routes, setRoutes] = useState([])
    // Menu 
    const [menu, setMenu] = useState([])
    const [routeBackend, setRouteBackend] = useState()
    const [latestVersion, setLatestVersion] = useState()

    const router = useRouter();

    // ** Hooks
    useEffect(() => {
        const initAuth = async () => {
            setCurrentRoute(router.pathname)

            const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
            if (storedToken) {
                setLoading(true)
                const data = JSON.parse(window.localStorage.getItem('userData'))
                setUnitsUser(JSON.parse(window.localStorage.getItem('userUnits')))
                setLoggedUnity(JSON.parse(window.localStorage.getItem('loggedUnity')))
                setRoutes(JSON.parse(window.localStorage.getItem('routes')))
                setMenu(JSON.parse(window.localStorage.getItem('menu')))
                if (data) {
                    setUser({ ...data })
                    setLoading(false)
                    return
                }

                // Desloga 
                localStorage.removeItem('userData')
                localStorage.removeItem('userUnits')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('accessToken')
                localStorage.removeItem('loggedUnity')
                localStorage.removeItem('routes')
                localStorage.removeItem('menu')
                setUser(null)
                setLoading(false)
                if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
                    router.replace('/login')
                }

            } else {
                setLoading(false)
            }
        }
        initAuth()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //* Login da fabrica (CPF)
    const handleLogin = (params, errorCallback) => {
        api.post('/login', params).then(async response => {
            setUnitsUser(response.data.unidades)
            localStorage.setItem('userUnits', JSON.stringify(response.data.unidades))
            // Verifica nº de unidades vinculadas ao usuário tentando logar
            if (response.status === 202 && params.verifyUnits) { // +1 unidade, modal pra selecionar unidade antes de logar
                setOpenModalSelectUnits(true)
                setUserAux(response.data.userData)
            } else {                      // 1 unidade, loga direto
                setOpenModalSelectUnits(false)
                params.rememberMe
                    ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
                    : null
                const returnUrl = router.query.returnUr
                setUser({ ...response.data.userData })

                // Verifica se usuário tem apenas uma unidade vinculada
                if (response.data.unidades.length == 1) {
                    setLoggedUnity(response.data.unidades[0])
                    localStorage.setItem('loggedUnity', JSON.stringify(response.data.unidades[0]))
                    getMenu(response.data.unidades[0].papelID)
                    // Recebe usuário e unidade e seta rotas de acordo com o perfil
                    getRoutes(response.data.userData.usuarioID, response.data.unidades[0].unidadeID, response.data.userData.admin, response.data.unidades[0].papelID)
                }

                setRouteBackend('/login')

                params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
                const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
                router.replace(redirectURL)
            }
        }).catch(err => {
            if (err?.response?.status === 400) {
                toast.error('CPF ou senha inválidos!')
            }
            if (errorCallback) errorCallback(err)
        })
    }

    //* Login do fornecedor (CNPJ)
    const handleLoginFornecedor = (params, errorCallback) => {
        api.post('/login-fornecedor', params).then(async response => {
            setUnitsUser(response.data.unidades)
            localStorage.setItem('userUnits', JSON.stringify(response.data.unidades))

            params.rememberMe
                ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
                : null
            const returnUrl = router.query.returnUr
            setUser({ ...response.data.userData })

            setRouteBackend('/login-fornecedor')

            setLoggedUnity(response.data.unidades[0])
            localStorage.setItem('loggedUnity', JSON.stringify(response.data.unidades[0]))
            getMenu(response.data.unidades[0].papelID)
            // Recebe usuário e unidade e seta rotas de acordo com o perfil
            getRoutes(response.data.userData.usuarioID, response.data.unidades[0].unidadeID, response.data.userData.admin, response.data.unidades[0].papelID)

            params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
            router.replace(redirectURL)

        }).catch(err => {
            if (err?.response?.status === 400) {
                toast.error('CNPJ ou senha inválidos!')
            }
            if (errorCallback) errorCallback(err)
        })
    }

    const handleLogout = () => {
        setUser(null)
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem('userUnits')
        window.localStorage.removeItem('loggedUnity')
        window.localStorage.removeItem('routes')
        window.localStorage.removeItem('menu')
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
        router.push(user.papelID === 2 ? '/fornecedor' : '/login') //? /login ou /login-fornecedor
    }

    const handleRegister = (params, errorCallback) => {
        axios
            .post(authConfig.registerEndpoint, params)
            .then(res => {
                if (res.data.error) {
                    if (errorCallback) errorCallback(res.data.error)
                } else {
                    handleLogin({ email: params.email, password: params.password })
                }
            })
            .catch(err => (errorCallback ? errorCallback(err) : null))
    }

    const getMenu = (papelID) => {
        const route = papelID === 2 ? '/login-fornecedor' : '/login'

        api.get(`${route}?papelID=${papelID}`, { headers: { 'function-name': 'getMenu' } }).then(response => {
            setMenu(response.data)
            localStorage.setItem('menu', JSON.stringify(response.data))
        }).catch(err => {
            console.log(err)
        })
    }

    const getRoutes = (usuarioID, unidadeID, admin, papelID) => {
        if (!usuarioID || !unidadeID || !papelID) return

        const route = papelID === 2 ? '/login-fornecedor' : '/login'
        // Busca rotas de acordo com o perfil do usuário e unidade logada
        api.get(`${route}?usuarioID=${usuarioID}&unidadeID=${unidadeID}&admin=${admin}&papelID=${papelID}`, { headers: { 'function-name': 'getRoutes' } }).then(response => {
            setRoutes(response.data)
            localStorage.setItem('routes', JSON.stringify(response.data))
        }).catch(err => {
            console.log("🚀 ~ setRoutes ~ err:", err)
        })
    }

    const removeDynamicRouteId = () => {
        const split = router.pathname.split('/')
        if (split[split.length - 1] === '[id]') {
            split.pop()
            setCurrentRoute(split.join('/'))
        }
    }

    //* Quando o usuario mudar de rota atualizar o currentRoute
    useEffect(() => {
        setCurrentRoute(router.pathname)
        if (currentRoute) {
            //  Se a rota atual for dinamica, remove o id da rota
            removeDynamicRouteId()
            const permission = routes.find(rota => rota.rota === currentRoute)
            if (!permission?.rota && currentRoute !== '/' && currentRoute !== '/login' && currentRoute !== '/login-fornecedor' && currentRoute !== '/esqueceu-sua-senha?type=login' && currentRoute !== '/esqueceu-sua-senha?type=fornecedor' && currentRoute !== '/redefinir-senha' && currentRoute !== '/fornecedor' && currentRoute !== '/registro' && currentRoute !== '/home' && currentRoute !== '/401') {
                router.push('/401')
            }
        }
    }, [currentRoute])

    //* faz um get ao github para saber a versão atual do sistema
    useEffect(() => {
        function getLatestTag() {
            axios.get("https://api.github.com/repos/PRECISACHAPECO/ged-frontend/releases")
                .then((response) => {
                    if (response.data && response.data.length > 0) {
                        const latestTag = response.data[0].tag_name;
                        setLatestVersion(latestTag);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        getLatestTag()
    }, [])

    const values = {
        user,
        getMenu,
        menu,
        routes,
        userAux,
        loading,
        setUser,
        setLoading,
        openModalSelectUnits,
        setOpenModalSelectUnits,
        unitsUser,
        setLoggedUnity,
        loggedUnity,
        getRoutes,
        login: handleLogin,
        loginFornecedor: handleLoginFornecedor,
        logout: handleLogout,
        register: handleRegister,
        latestVersion
    }

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
