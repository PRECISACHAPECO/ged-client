<<<<<<< HEAD
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
=======
import { PDFViewer, BlobProvider, Document, Page, Text, View, Table, StyleSheet } from '@react-pdf/renderer';
import LayoutReport from 'src/components/Reports/Layout'

const ContentReport = () => {

    // Criar array com 100 posições 
    const arrayTest = Array.from(Array(50).keys())

    const data = [
        {
            id: 1,
            nome: 'Bloco 1',
            itens: [
                {
                    id: 1,
                    item: 'Os fornecedores receberam treinamento de BPF e boas práticas de fabricação ?',
                    resultado: 'Sim',
                    observacao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                },
                {
                    id: 2,
                    item: 'Existe local próprio pra armazenagem dos insumos ?',
                    resultado: 'Sim',
                    observacao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                },
                {
                    id: 3,
                    item: 'Os insumos são armazenados em local adequado ?',
                    resultado: 'Sim',
                    observacao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                },
            ]
        },
        {
            id: 2,
            nome: 'Bloco 2',
            itens: [
                {
                    id: 1,
                    item: 'Os fornecedores receberam treinamento de BPF ?',
                    resultado: 'Sim',
                    observacao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                },
                {
                    id: 2,
                    item: 'Existe local próprio pra armazenagem dos insumos ?',
                    resultado: 'Sim',
                    observacao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                },
                {
                    id: 3,
                    item: 'Os insumos são armazenados em local adequado ?',
                    resultado: 'Sim',
                    observacao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                },
            ]
        }
    ]

    const styles = StyleSheet.create({
        table: {
            fontSize: 10,

        },
        header: {
            backgroundColor: '#EEE',
            padding: 10,
            borderTop: '1px solid #ddd',
            borderLeft: '1px solid #ddd',
            borderRight: '1px solid #ddd',
            // border radius somente no topo
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
        },
        body: {
            width: '100%',
            borderTop: '1px solid #ddd',
            borderRight: '1px solid #ddd',
            borderBottomLeftRadius: 3,
            borderBottomRightRadius: 3,
            marginBottom: 10
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            borderBottom: '1px solid #ddd',
        },
        column: {
            flex: 1,
            padding: 10,
            display: 'flex',
            alignItems: 'center',
            borderLeft: '1px solid #ddd',
            flexDirection: 'row',
            flexWrap: 'wrap',
            maxWidth: '100%',
        }
    })

    return (
        <View >
            {
                <>

                    {
                        data.map((bloco, indexBlock) => (
                            <View style={styles.table} key={indexBlock} >
                                <Text style={styles.header} >{bloco.nome}</Text>
                                <View style={styles.body}>
                                    {
                                        bloco.itens.map((item, indexItem) => (
                                            <View style={styles.row} key={indexItem}>
                                                <View style={{
                                                    ...styles.column,
                                                    flex: 0.5
                                                }}  >
                                                    <Text>{item.item}</Text>
                                                </View>
                                                <View style={{
                                                    ...styles.column,
                                                    flex: 0.2
                                                }}  >
                                                    <Text>{item.resultado}</Text>
                                                </View>
                                                <View style={{
                                                    ...styles.column,
                                                    flex: 0.3
                                                }}  >
                                                    <Text>{item.observacao}</Text>
                                                </View>
                                            </View>
                                        ))
                                    }
                                </View>
                            </View>
                        ))
                    }

                    {
                        arrayTest.map((item, index) => (
                            <Text style={{ marginVertical: 5 }} key={index} >{`Imprimindo item numero ${index} pq to testando os textos dos relatorios utilizando a lib react-pdf lorem ipsum pq sim haha uash uiashju ksaj usah uashusau usahuash ashu uhasu uahsuhas has uhasu hsauh sahh sauh`}</Text>
                        ))
                    }


                </>
            }

        </View >
    )
}

>>>>>>> 567beb06fd77dce2ec622c60ed1a137786d0b8d0

const CrmAward = () => {
    return (
<<<<<<< HEAD
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
=======
        <LayoutReport
            title='Teste de relatório 4'
            content={<ContentReport />}
        />
    )
>>>>>>> 567beb06fd77dce2ec622c60ed1a137786d0b8d0
};

export default CrmAward;
