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


const CrmAward = () => {
    return (
        <LayoutReport
            title='Teste de relatório 4'
            content={<ContentReport />}
        />
    )
};

export default CrmAward;