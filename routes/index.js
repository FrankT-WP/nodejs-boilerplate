module.exports = (app) => {
    const user = require('./user.route')
    const job = require('./job.route')

    app.use('/api/user', user)
    app.use('/api/job', job)
}