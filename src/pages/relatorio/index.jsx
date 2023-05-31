import BlankLayout from 'src/@core/layouts/BlankLayout'
import Fornecedor from './formularios/fornecedor'
import PageReport from 'src/components/Defaults/Reports/PageReport'

const InvoicePrint = () => {
    const reportParameters = JSON.parse(localStorage.getItem('reportParameters'))

    if (reportParameters) {
        switch (reportParameters.component) {
            case 'Fornecedor':
                return <Fornecedor data={reportParameters} />
            default:
                return <div>Conteudo não encontrado</div>
        }
    }
}

InvoicePrint.getLayout = page => (
    <BlankLayout>
        <PageReport>{page}</PageReport>
    </BlankLayout>
)

InvoicePrint.setConfig = () => {
    return {
        mode: 'light'
    }
}

export default InvoicePrint
