// ** React Imports
import { createContext, useEffect, useState } from 'react'
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
    // Rotas 
    const [routes, setRoutes] = useState([])
    // Menu 
    const [menu, setMenu] = useState([])

    // ** Hooks
    const router = useRouter()
    useEffect(() => {
        const initAuth = async () => {
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

    const handleLogin = (params, errorCallback) => {
        api.post('/login', params).then(async response => {
            setUnitsUser(response.data.unidades)
            localStorage.setItem('userUnits', JSON.stringify(response.data.unidades))

            getMenu()

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
                    // Recebe usuário e unidade e seta rotas de acordo com o perfil
                    getRoutes(response.data.userData.usuarioID, response.data.unidades[0].unidadeID)
                }

                params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
                const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
                router.replace(redirectURL)
            }
        }).catch(err => {
            if (err.response.status === 400) {
                toast.error('E-mail ou senha inválidos!')
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
        router.push('/login')
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

    const getMenu = () => {
        api.get('/login', { headers: { 'function-name': 'getMenu' } }).then(response => {
            console.log("🚀 ~ getMenu ~ response.data:", response.data)
            setMenu(response.data)
            localStorage.setItem('menu', JSON.stringify(response.data))
        }).catch(err => {
            console.log("🚀 ~ getMenu ~ err:", err)
        })
    }

    const getRoutes = (usuarioID, unidadeID) => {
        console.log("🚀 ~ getRoutes ~ usuarioID, unidadeID:", usuarioID, unidadeID)
        if (!usuarioID || !unidadeID) return

        console.log('Obtem novas rotas...')
        // Busca rotas de acordo com o perfil do usuário e unidade logada
        api.get(`/login?usuarioID=${usuarioID}&unidadeID=${unidadeID}`, { headers: { 'function-name': 'getRoutes' } }).then(response => {
            console.log("🚀 ~ setRoutes ~ response.data:", response.data)
            setRoutes(response.data)
            localStorage.setItem('routes', JSON.stringify(response.data))
        }).catch(err => {
            console.log("🚀 ~ setRoutes ~ err:", err)
        })
    }

    const values = {
        user,
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
        logout: handleLogout,
        register: handleRegister,
    }

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
