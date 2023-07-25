import { StyleSheet } from '@react-pdf/renderer'
import { Font } from '@react-pdf/renderer'
import InterBold from './fonts/Inter-Bold.ttf'
import PoppinsBold from './fonts/Poppins-Bold.ttf'
import PoppinsRegular from './fonts/Poppins-Regular.ttf'
import InterRegular from './fonts/Inter-Regular.ttf'

//? Inter
Font.register({
    family: 'InterRegular',
    src: InterRegular
})
Font.register({
    family: 'InterBold',
    src: InterBold
})

//? Poppins
Font.register({
    family: 'PoppinsRegular',
    src: PoppinsRegular
})
Font.register({
    family: 'PoppinsBold',
    src: PoppinsBold
})

export const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFF',
        justifyContent: 'start',
        paddingTop: 15,
        paddingBottom: 30
    },
    title: {
        fontFamily: 'InterBold'
    },

    header: {
        position: 'fixed',
        top: -5,
        left: 0,
        right: 0,
        margin: '0 auto',
        fontSize: 12,
        height: 50,
        width: '92%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    content: {
        marginHorizontal: 10,
        fontSize: 11,
        padding: 15,
        flex: 1
    },

    footer: {
        position: 'absolute',
        bottom: 20,
        color: 'grey',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        fontSize: 10
    },

    // Text / Title
    blockTitle: {
        paddingVertical: 5,
        fontFamily: 'InterBold'
    },
    containerFields: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        paddingTop: 7
    },
    fields: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        paddingBottom: 10,
        paddingTop: 10
    },
    fieldTitle: {
        fontSize: 8,
        opacity: '0.8'
    },
    fieldValue: {
        fontSize: 10
    },

    // Separator
    separator: {
        height: '1px',
        width: '100%',
        borderBottom: '1px solid #ddd'
    },

    // Table
    table: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #ddd',
        borderTop: '1px solid #ddd',
        borderBottom: '1px solid #ddd',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    tableTitle: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        fontSize: 8,
        backgroundColor: '#EEE',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        borderLeft: '1px solid #ddd',
        fontFamily: 'InterBold'
    },
    tableTitlecolumn: {
        padding: 8
    },
    tableContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    tableContent: {
        padding: 8,
        borderLeft: '1px solid #ddd',
        borderTop: '1px solid #ddd'
    },
    tableContentcolumn: {
        fontSize: 9
    }
})
