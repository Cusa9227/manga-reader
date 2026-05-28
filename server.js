const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.static('public'))

const MANGADEX_API = 'https://api.mangadex.org'
const MANGADEX_CDN = 'https://uploads.mangadex.org'

// Search manga
app.get('/api/search', async (req, res) => {
    try {
        const title = encodeURIComponent(req.query.q || '')
        const response = await fetch(
            `${MANGADEX_API}/manga?title=${title}&includes[]=cover_art&limit=20&contentRating[]=safe&contentRating[]=suggestive`
        )
        const data = await response.json()
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get manga details
app.get('/api/manga/:id', async (req, res) => {
    try {
        const response = await fetch(
            `${MANGADEX_API}/manga/${req.params.id}?includes[]=author&includes[]=cover_art`
        )
        const data = await response.json()
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get chapters
app.get('/api/manga/:id/chapters', async (req, res) => {
    try {
        const response = await fetch(
            `${MANGADEX_API}/manga/${req.params.id}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=500`
        )
        const data = await response.json()
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get chapter pages
app.get('/api/chapter/:id', async (req, res) => {
    try {
        const response = await fetch(
            `${MANGADEX_API}/at-home/server/${req.params.id}`
        )
        const data = await response.json()
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
