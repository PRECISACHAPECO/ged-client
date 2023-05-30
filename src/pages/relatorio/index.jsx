// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Fornecedor from './fornecedor'

const InvoicePrint = () => {
    const reportParameters = JSON.parse(localStorage.getItem('reportParameters'))
    localStorage.removeItem('reportParameters')

    if (reportParameters) {
        switch (reportParameters.component) {
            case 'Fornecedor':
                return <Fornecedor />
            default:
                return <div>Conteudo não encontrando</div>
        }
    }
}

InvoicePrint.getLayout = page => <BlankLayout>{page}</BlankLayout>
InvoicePrint.setConfig = () => {
    return {
        mode: 'light'
    }
}

export default InvoicePrint
