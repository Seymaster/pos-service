  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with MongoDB databases.
  |
  */

db_username = process.env.dbUsername
db_password = process.env.dbPassword

module.exports = {
    dbUrl: `mongodb+srv://${db_username}:${db_password}@cluster0.2ip3w.mongodb.net/pos`
}