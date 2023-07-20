import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFF',
        justifyContent: 'start',
        paddingTop: 15,
        paddingBottom: 30
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
        backgroundColor: 'orange',
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
    }
})
