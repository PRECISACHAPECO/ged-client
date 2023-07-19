import React, { useState, useEffect } from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
    },
    table: {
        width: '100%',
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 30,
        marginRight: 30,
    },
    tableHeader: {
        backgroundColor: '#F0F0F0',
        color: '#000',
        padding: 10,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        padding: 5,
        fontSize: 10,
    },
});

const FornecedorPDF = () => {
    const data = [
        { id: 1, name: 'Item 1', quantity: 10, price: 20 },
        { id: 2, name: 'Item 2', quantity: 5, price: 15 },
        { id: 3, name: 'Item 3', quantity: 3, price: 12 },
    ];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>ID</Text>
                        <Text style={styles.tableHeader}>Nome</Text>
                        <Text style={styles.tableHeader}>Quantidade</Text>
                        <Text style={styles.tableHeader}>Preço</Text>
                    </View>
                    {data.map((item) => (
                        <View style={styles.tableRow} key={item.id}>
                            <Text style={styles.tableCell}>{item.id}</Text>
                            <Text style={styles.tableCell}>{item.name}</Text>
                            <Text style={styles.tableCell}>{item.quantity}</Text>
                            <Text style={styles.tableCell}>{item.price}</Text>
                        </View>
                    ))}
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
                <button onClick={handleOpenReport}>Abrir relatório</button>
            )}

            {showReport && (
                <PDFViewer width="100%" height="500px">
                    <FornecedorPDF />
                </PDFViewer>
            )}
        </div>
    );
};

export default CrmAward;
