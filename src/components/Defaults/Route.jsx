import Router from 'next/router'
import { ParametersContext } from 'src/context/ParametersContext'

const Route = ({ path }) => {
    const router = Router
    const { setId } = useContext(ParametersContext)

    const goRoute = () => {
        setId(null)
        router.push(path)
    }

    return goRoute
}

export default Route
