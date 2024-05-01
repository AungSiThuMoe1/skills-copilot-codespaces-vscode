//Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'socialnetwork',
    password: 'password',
    port: 5432,
});

app.get('/comments', async (req, res) => {
    try {
        const comments = await pool.query('SELECT * FROM comments');
        res.json(comments.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.get('/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await pool.query('SELECT * FROM comments WHERE comment_id = $1', [id]);
        res.json(comment.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/comments', async (req, res) => {
    const { comment, user_id, post_id } = req.body;
    try {
        const newComment = await pool.query('INSERT INTO comments (comment, user_id, post_id) VALUES ($1, $2, $3) RETURNING *', [comment, user_id, post_id]);
        res.json(newComment.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    try {
        const updateComment = await pool.query('UPDATE comments SET comment = $1 WHERE comment_id = $2', [comment, id]);
        res.json('Comment was updated!');
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteComment = await pool.query('DELETE FROM comments WHERE comment_id = $1', [id]);
        res.json('Comment was deleted!');
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(3003, () => {
    console.log('Server is running on port 3003');
});