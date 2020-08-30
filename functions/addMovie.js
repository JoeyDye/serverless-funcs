const { query } = require('./utils/hasura')

exports.handler = async function ({ body }) {
  const { movie } = JSON.parse(body)
  const ADD_MOVIE = `
    mutation AddMovie($movie: movies_insert_input! = {}) {
      insert_movies_one(object: $movie) {
        id
        poster
        tagline
        title
      }
    }
  `
  const result = await query({
    query: ADD_MOVIE,
    variables: {
      movie,
    },
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ result }),
  }
}
