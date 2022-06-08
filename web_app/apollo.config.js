module.exports = {
  client: {
    tagName: "web_app",
    service: {
      addTypename: false,
      url: 'http://localhost:4000/graphql',
      skipSSLValidation: true
    }

  }
}