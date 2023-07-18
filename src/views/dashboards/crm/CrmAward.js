import { useState } from 'react';
import { BlobProvider, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const FornecedorPDF = () => {
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );
};

const CrmAward = () => {
    const [showReport, setShowReport] = useState(false);

    const handleOpenReport = () => {
        setShowReport(true);
    };

    return (
        <div>
            {!showReport && (
                <a href="#" onClick={handleOpenReport}>
                    Abrir relatório
                </a>
            )}

            {showReport && (
                <BlobProvider document={<FornecedorPDF />}>
                    {({ blob, url, loading, error }) => (
                        <div>
                            {loading ? (
                                'Carregando o PDF...'
                            ) : (
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    Abrir em uma nova guia
                                </a>
                            )}
                        </div>
                    )}
                </BlobProvider>
            )}
        </div>
    );
};

export default CrmAward;
