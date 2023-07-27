// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

export const getHomeRoute = role => {
  if (role === 'client') return '/acl'
  else return '/home'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

<<<<<<< HEAD
    console.log('Home....')

    useEffect(() => {
        if (!router.isReady) {
            return
        }

        if (auth.user && auth.user.role) {
            console.log('useEffect no index.js')
            const homeRoute = getHomeRoute(auth.user.role)
=======
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (auth.user && auth.user.role) {
      const homeRoute = getHomeRoute(auth.user.role)
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

      // Redirect user to Home URL
      router.replace(homeRoute)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner />
}

export default Home
