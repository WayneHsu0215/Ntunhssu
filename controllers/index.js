/* eslint-disable no-unused-vars */
import {Router} from "express";
import sql from 'mssql';

const router = Router();

router.get('/check-auth', (req, res) => {
    if (req.session && req.session.user) {
        res.json({loggedIn: true});
    } else {
        res.json({loggedIn: false});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const pool = req.app.locals.pool;

        const query = `SELECT AccID, Password
                       FROM Account
                       WHERE AccID = @username;`;

        const result = await pool.request()
            .input('username', username)
            .query(query);

        console.log("Query Result: ", result.recordset);

        if (result.recordset.length > 0) {
            if (password === result.recordset[0].Password) {
                req.session.user = {AccID: username};
                res.json({success: true, message: 'Login successful'});
            } else {
                res.status(401).json({success: false, message: 'Invalid Credentials'});
            }
        } else {
            res.status(401).json({success: false, message: 'Invalid Credentials'});
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/reply', async (req, res) => {
    try {
        const pool = req.app.locals.pool;

        const result = await pool.request().query('SELECT ID, Class, StudentID, Name, Gender, Content, CONVERT(varchar, UP_Date, 20) AS UP_Date, UP_User FROM Reply ORDER BY ID ASC;');

        console.log(result);

        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Reply table', err);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/reply', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const newReply = req.body;

        const result = await pool.request()
            .input('Class', sql.NVarChar, newReply.Class)
            .input('StudentID', sql.NVarChar, newReply.StudentID)
            .input('Name', sql.NVarChar, newReply.Name)
            .input('Gender', sql.NVarChar, newReply.Gender)
            .input('Content', sql.NVarChar, newReply.Content)
            .query('INSERT INTO Reply (Class, StudentID, Name, Gender, Content, UP_Date) VALUES (@Class, @StudentID, @Name, @Gender, @Content, GETDATE())');

        res.status(201).json({message: 'Reply added successfully'});
    } catch (err) {
        console.error('Error adding new reply', err);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/reply/gender', async (req, res) => {
    try {
        const pool = req.app.locals.pool;

        const result = await pool.request().query(
            `-- 統計性別
             SELECT 'Gender' AS Category, Gender AS Item, COUNT(*) AS Count
             FROM Reply
             GROUP BY Gender
             UNION ALL
             -- 統計 Class
             SELECT 'Class' AS Category, Class AS Item, COUNT(*) AS Count
             FROM Reply
             GROUP BY Class
             UNION ALL
             -- 統計 Name
             SELECT 'Name' AS Category, Name AS Item, COUNT(*) AS Count
             FROM Reply
             GROUP BY Name
             UNION ALL
             -- 統計總數
             SELECT 'Total' AS Category, '總數' AS Item, COUNT(*) AS Count
             FROM Reply`
        );

        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Gender Count', err);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/reply/score', async (req, res) => {
    try {
        const pool = req.app.locals.pool;

        const result = await pool.request().query(
            `SELECT 'StudentID' AS Category, StudentID AS Item, COUNT(*) AS Count
             FROM Reply
             GROUP BY StudentID`
        );

        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Gender Count', err);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/reply/:ID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const {ID} = req.params;

        const result = await pool.request()
            .input('ID', sql.NVarChar, ID)
            .query('SELECT ID, Class, StudentID, Name,Gender, Content, CONVERT(varchar, UP_Date, 20) AS UP_Date, UP_User FROM Reply WHERE ID = @ID');

        if (result.recordset.length === 0) {
            res.status(404).send('Reply not found');
            return;
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error querying reply by ID', err);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/reply/:ID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const {ID} = req.params;

        const result = await pool.request()
            .input('ID', sql.NVarChar, ID)
            .query('DELETE FROM Reply WHERE ID = @ID');

        if (result.rowsAffected[0] === 0) {
            res.status(404).send('Reply not found');
            return;
        }

        res.status(200).json({message: 'Reply deleted successfully'});
    } catch (err) {
        console.error('Error deleting reply', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/len', async (req, res) => {
    try {
        const pool = req.app.locals.pool;

        const result = await pool.request().query('SELECT ID, Class, StudentID, Name, Gender, Content, CONVERT(varchar, UP_Date, 20) AS UP_Date, UP_User, LEN(Content) AS ContentLength FROM Reply ORDER BY ContentLength DESC;');

        console.log(result);

        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Reply table by content length', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/star', async (req, res) => {
    try {
        const pool = req.app.locals.pool;

        const result = await pool.request().query('SELECT ID, Class, StudentID, Name, Gender, Content, CONVERT(varchar, UP_Date, 20) AS UP_Date, UP_User FROM Reply ORDER BY UP_User DESC;');

        console.log(result);

        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Reply table by UP_User', err);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/reply/:ID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const {ID} = req.params;

        // 先查詢目前的 UP_User 值
        const currentResult = await pool.request()
            .input('ID', sql.NVarChar, ID)
            .query('SELECT UP_User FROM Reply WHERE ID = @ID');

        if (currentResult.recordset.length === 0) {
            res.status(404).send('Reply not found');
            return;
        }

        // 判斷目前的 UP_User 值，並設置新值
        const currentUPUser = currentResult.recordset[0].UP_User;
        const newUPUser = currentUPUser === 1 ? 0 : 1;

        // 更新 UP_User
        const updateResult = await pool.request()
            .input('ID', sql.NVarChar, ID)
            .input('UP_User', sql.Int, newUPUser)
            .query('UPDATE Reply SET UP_User = @UP_User WHERE ID = @ID');

        if (updateResult.rowsAffected[0] === 0) {
            res.status(404).send('Reply not found');
            return;
        }

        res.status(200).json({message: 'Reply updated successfully'});
    } catch (err) {
        console.error('Error updating reply', err);
        res.status(500).send('Internal Server Error');
    }
});


export default router;
