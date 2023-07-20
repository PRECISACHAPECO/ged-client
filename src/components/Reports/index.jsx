import { BlobProvider } from '@react-pdf/renderer'

const GenerateReport = ({ component }) => {
    return (
        <BlobProvider document={component}>
            {({ blob, url, loading, error }) => (
                <div>
                    {loading ? (
                        'Carregando o PDF...'
                    ) : (
                        <a href={url} target='_blank' rel='noopener noreferrer'>
                            Abrir em uma nova guia
                        </a>
                    )}
                </div>
            )}
        </BlobProvider>
    )
}

export default GenerateReport
