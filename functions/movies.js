const { URL } = require('url')
const fetch = require('node-fetch')
const { query } = require('./utils/hasura')

exports.handler = async () => {
  const GET_MOVIES = `
    query GetMovies {
        movies {
          id
          poster
          tagline
          title
        }
      }
  `
  const { movies } = await query({ query: GET_MOVIES })
  const api = new URL('https://www.omdbapi.com/')
  const { searchParams } = api

  // add the secret API key to the query string
  searchParams.set('apikey', process.env.OMDB_API_KEY)

  const promises = movies.map(({ id, ...movie }) => {
    // use the movie's IMDB to look up details
    searchParams.set('i', id)

    return fetch(api)
      .then(res => res.json())
      .then(({ Ratings }) => ({ ...movie, id, scores: Ratings }))
  })

  const moviesWithRatings = await Promise.all(promises)

  return {
    statusCode: 200,
    body: JSON.stringify(moviesWithRatings),
  }
}
