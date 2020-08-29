exports.handler = async ({ queryStringParameters }) => {
  const { text } = queryStringParameters

  return {
    statusCode: 200,
    body: `You said: ${text}`,
  }
}
