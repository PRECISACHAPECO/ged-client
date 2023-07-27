import Router from 'next/router'
import { useContext } from 'react'
import { RouteContext } from 'src/context/RouteContext'

const Route = ({ path }) => {
    const router = Router
    const { setId } = useContext(RouteContext)

    const goRoute = () => {
        setId(null)
        router.push(path)
    }

    return goRoute
}

export default Route
