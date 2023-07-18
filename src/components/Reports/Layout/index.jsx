import React, { useEffect, useState } from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import GenerateReport from 'src/components/Reports'
import { styles } from './Style'

const Layout = ({ title, content }) => {
    return (
        <>
            <GenerateReport
                component={
                    <Document>
                        <Page size='A4' style={styles.page}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={{ fontWeight: 'bold' }}>{title}</Text>
                            </View>

                            {/* Content */}
                            <View style={styles.content}>{content}</View>

                            {/* Footer */}
                            <View style={styles.footer} fixed>
                                <Text>
                                    Gerado em{' '}
                                    {new Date().toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Text>

                                <Text render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} />
                            </View>
                        </Page>
                    </Document>
                }
            />
        </>
    )
}

export default Layout
