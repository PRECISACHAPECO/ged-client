function FilterDataNewContent() {
    function filterDataNew(param) {
        const searchData = []

        const { q = '' } = param
        const queryLowered = q.toLowerCase()

        const exactData = {
            Geral: []
        }

        const includeData = {
            Geral: []
        }
        searchData.forEach(obj => {
            const isMatched = obj.title.toLowerCase().startsWith(queryLowered)
            if (isMatched && exactData[obj.category].length < 5) {
                exactData[obj.category].push(obj)
            }
        })
        searchData.forEach(obj => {
            const isMatched =
                !obj.title.toLowerCase().startsWith(queryLowered) && obj.title.toLowerCase().includes(queryLowered)
            if (isMatched && includeData[obj.category].length < 5) {
                includeData[obj.category].push(obj)
            }
        })
        const categoriesCheck = []
        Object.keys(exactData).forEach(category => {
            if (exactData[category].length > 0) {
                categoriesCheck.push(category)
            }
        })
        if (categoriesCheck.length === 0) {
            Object.keys(includeData).forEach(category => {
                if (includeData[category].length > 0) {
                    categoriesCheck.push(category)
                }
            })
        }
        const resultsLength = categoriesCheck.length === 1 ? 5 : 3

        return [200, [...exactData.Geral.concat(includeData.Geral).slice(0, resultsLength)]]
    }
    return filterDataNew
}

export default FilterDataNewContent
