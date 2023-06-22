const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
});

async function performDatabaseOperations() {
    const connection = await pool.getConnection();

    try {
        await insertData(connection);
        const names = await retrieveData(connection);
        return names;
    } finally {
        connection.release();
    }
}

async function insertData(connection) {
    const sql_insert = `INSERT INTO people(name) VALUES('Bruno')`;
    await connection.query(sql_insert);
}

async function retrieveData(connection) {
    const sql_query = `SELECT * FROM people`;
    const [rows] = await connection.query(sql_query);

    const namesList = rows.map((row) => `<li>${row.name}</li>`).join('');

    return namesList;
}

app.get('/', async (req, res) => {
    try {
        const names = await performDatabaseOperations();

        res.send(`
            <h1>Full Cycle Rocks!</h1>
            <ul>
                ${names}
            </ul>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log('Rodando na porta ' + port);
});
