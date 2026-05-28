const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.static('public'))

const MANGADEX_API = 'https://api.mangadex.org'

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Referer': 'https://mangadex.org',
    'Origin': 'https://mangadex.org',
}

// Search manga
app.get('/api/search', async (req, res) => {
    try {
        const title = encodeURIComponent(req.query.q || '')
        const response = await fetch(
            `${MANGADEX_API}/manga?title=${title}&includes[]=cover_art&limit=20&contentRating[]=safe&contentRating[]=suggestive`,
            { headers: HEADERS }
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
            `${MANGADEX_API}/manga/${req.params.id}?includes[]=author&includes[]=cover_art`,
            { headers: HEADERS }
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
            `${MANGADEX_API}/manga/${req.params.id}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=500`,
            { headers: HEADERS }
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
            `${MANGADEX_API}/at-home/server/${req.params.id}`,
            { headers: HEADERS }
        )
        const data = await response.json()
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Proxy images
app.get('/api/image', async (req, res) => {
    try {
        const url = req.query.url
        if (!url) return res.status(400).send('No URL provided')
        const response = await fetch(url, { headers: HEADERS })
        res.set('Content-Type', response.headers.get('content-type'))
        response.body.pipe(res)
    } catch (err) {
        res.status(500).send('Image failed to load')
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
