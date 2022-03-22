import faunadb from 'faunadb'

function account(res) {
    if (!res || !res.responseHeaders) return
    console.log(res.responseHeaders)
}

export default new faunadb.Client({
    secret: process.env.FAUNA_SERVER_KEY,
    observer: account
})