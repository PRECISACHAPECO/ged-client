// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Router from 'next/router'

// ** Demo Components Imports
import Fornecedor from './fornecedor'

const InvoicePrint = (componente, id) => {
    const router = Router
    const Nome = router.query.nome

    return <Fornecedor id='4987' />
}
InvoicePrint.getLayout = page => <BlankLayout>{page}</BlankLayout>
InvoicePrint.setConfig = () => {
    return {
        mode: 'light'
    }
}

export default InvoicePrint
