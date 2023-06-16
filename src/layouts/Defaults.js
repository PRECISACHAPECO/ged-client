import { SettingsContext } from 'src/@core/context/settingsContext'
const { settings } = useContext(SettingsContext)
const mode = settings.mode
Chamada: sx = { getZebradoStyle(indexItem) }

const getZebradoStyle = (index, mode) => ({
    backgroundColor:
        index % 2 !== 1 ? (mode === 'light' || mode === 'semi-dark' ? '#f7f7f9' : '#282a42') : 'inherit',
    padding: '0.5rem',
    borderBottom: '1px solid #4c4e641f',
    borderRadius: '0.2rem'
})

module.exports = { getZebradoStyle }