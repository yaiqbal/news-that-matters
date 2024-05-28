# Northcoders News API

## Environment variables
### Creating the databases
We will have two databases in this project- one for development data, and another scaled down data for testing.

Create two .env files - .env.test and .env.development. In each of the files, add PGDATABASE=_database-name_. Replace _database-name_ with the correct database name depending on the environment (i.e development or test). Ensure that both the .env files are .gitignored.
