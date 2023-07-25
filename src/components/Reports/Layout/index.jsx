// import React, { useEffect, useState } from 'react'
import { Text } from '@react-pdf/renderer'
import GenerateReport from 'src/components/Reports'
// import { styles } from './Style'

const Layout = ({ title, titleButton, content }) => {
    return (
        <>
            <GenerateReport title={titleButton} component={<Text>Ola</Text>} />
        </>
    )
}

export default Layout
