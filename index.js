const session = require('express-session');
const bodyParser = require('body-parser');
const express = require('express');
const shows = require('./shows');
const Joi = require('@hapi/joi');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
const TWO_HOURS = 1000 * 360 * 2;
const {
    PORT = 5000,
    SESS_LIFETIME = TWO_HOURS,
    // NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'jghgfm',
} = process.env

//const IN_PROD = NODE_ENV==='production'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        // secure: IN_PROD,

    },
    key: 'user_sid',

}))

app.use(express.json());

app.get('/api/shows', (req, res) => {

    shows.randomShows(res);
});

app.post('/api/shows', (req, res) => {

    const search = req.body.searchWord;
    console.log(search);

    if (!search) {
        return res.status(400).json({ msg: 'No search word.' });
        console.log("search word: " + search);
    }
    else {
        shows.searchShows(res, search);
    }
});

app.post('/api/getMyFavouriteShows', async (req, res) => {
    console.log('getMyFavouriteShows body',req.body);
    console.log('getMyFavouriteShows user id ',req.body.userId);
    await getUserFavouriteShows(req, res);
});

async function getUserFavouriteShows(req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const favouriteShows =  await getFavouriteShows(req, res);
            if (!favouriteShows) {

                console.log('favouriteShows doesn`t exists');
                res.send('favouriteShows doesn`t exists');

            }
        }
        catch(error){
            console.log('Catched this in getUserFavouriteShows',error);
            //console.log(error.message);
            res.sendStatus(500);
        }
    });
}

async function getFavouriteShows(req, res) {
    return new Promise((resolve, reject) => {
            const db = connectDb();
            const user_id = req.body.userId;
            //const user_id = req.userId;
            console.log("in getFavouriteShows user id: "+user_id);
            let sql = `SELECT * FROM shows WHERE id IN (SELECT showId FROM usershow WHERE userId = '${user_id}')`;

            db.query(sql, (err, result) => {
                if (err){
                    closeDb(db);
                    reject(err);
                }
                console.log(result);
                closeDb(db);
                resolve(result);
            });


    });

}




app.post('/api/addFavouriteShow', (req, res) => {

    console.log(req.body);
    (async () => {

        await insertShow(req, res);




    })();

});


async function getShowById(db, id) {
    return new Promise((resolve, reject) => {
    const db = connectDb();
        console.log("in getShowById");
        let sql = `SELECT * FROM shows WHERE id = '${id}'`;

        db.query(sql, (err, result) => {
            if (err) {
                closeDb();
                reject(err);
            }
            console.log(result);
            closeDb();
            resolve(result);
        });
    });

}

async function insertShow(req, res) {
    return new Promise((resolve, reject) => {
        try {

            console.log("In insertShow");
            const db = connectDb();
            const myShow = req.body
            const userId = myShow.userId;
            console.log("userId: ", userId);
            const receivedShow = { name: myShow.name, language: myShow.language, premiered: myShow.premiered, rating: myShow.rating };
            const key1 = myShow.name.slice(1, myShow.name.length - 1);
            console.log("key1: ", key1);
            const key2 = myShow.language.slice(1, myShow.language.length - 1);
            console.log("key2: ", key2);
            const receivedShowId = key1.concat(key2);
            console.log("receivedShowId" + receivedShowId);

            //const ShowId = shows.getShowId(receivedShowId);
            // console.log("ShowId: ", ShowId);

            const newShow = {
                id: receivedShowId,
                name: key1,
                language: key2,
                premiered: myShow.premiered.slice(1, myShow.premiered.length - 1),
                rating: myShow.rating,
                imageUrl : myShow.imageUrl,
            };
            shows.insertNewShow(db, newShow)
                .then(function (value) {
                    return new Promise((resolve, reject) => {
                        const genres = myShow.genres;
                        let sql3 = 'INSERT INTO userShow (userId, showId) VALUES ("' + userId + '","' + receivedShowId + '");';
                        genres.forEach(genre => {
                            console.log('genre: ' + genre);
                            sql3 += 'INSERT INTO genres (genre) VALUES ("' + genre + '"); INSERT INTO genresShows (genre , showId) VALUES ("' + genre + '","' + receivedShowId + '");';
                            console.log('sql3:  ' + sql3);
                        });
                        let query3 = db.query(sql3, (err, result) => {
                            if (err) {
                                closeDb(db);
                                console.log(err);
                                reject(err);
                                return;
                            }
                            res.json({ msg: "successfully inserted all" });
                            console.log("successfully inserted all");
                            closeDb(db);
                            resolve(result);
                        });

                    })
                });
        }
        catch (error) {
            console.log('Catched this:');
            console.log(error.message);
            res.sendStatus(500);
        }


    });

}

app.post('/api/logout', (req, res) => {

});

app.post('/api/login', (req, res) => {

    console.log(req.body);
    (async () => {

        await loginUser(req, res);

    })();

});

async function loginUser(req, res) {
    console.log('Start login.');
    console.log(req.body);
    try {
        const userData = await validateForm(req, res);
        const user = await getUser(userData);
        if (!user) {
            res.send('User doesn`t exists');
            return;
        }
        console.log(user);
        // req.session.userid = user[0].id;
        // res.locals.user = user[0].id;
        //console.log(req.session);
        //console.log("req.session.userId ", req.session.userid);
        console.log("User logged in successfully: " + JSON.stringify(user));
        res.json({ userId: user[0].id });
    }
    catch (error) {
        console.log('Catched this:');
        console.log(error.message);
        res.sendStatus(500);
    }
}

async function getUser(postedUser) {
    return new Promise((resolve, reject) => {
        const { email, password } = postedUser;
        console.log("In getUser");
        console.log("email: " + email);
        const db = connectDb();
        let sql = `SELECT * FROM users WHERE email = '${email}'`;
        db.query(sql, (err, result) => {
            if (err) {

                closeDb(db);
                reject(err);

            }
            console.log(result);
            closeDb(db);
            resolve(result);

        });
    });

}

app.post('/api/register', (req, res) => {

    console.log(req.body);
    (async () => {

        await registerUser(req, res);

    })();
});

async function registerUser(req, res) {

    console.log('Start register user.');
    console.log(req.body);
    try {
        const userData = await validateForm(req, res);
        const newUserId = await createUser(userData);
        console.log("New user registered successfully with id: " + newUserId);
        res.json({ msg: 'New user registered successfully with id: ' + newUserId });
    } catch (error) {
        console.log('Catched this:');
        console.log(error.message, error);
        res.sendStatus(500);
    }
}

async function validateForm(req, res) {
    return new Promise((resolve, reject) => {

        console.log('function validateForm');
        const { email, password } = req.body
        console.log('email: ' + email + ' password: ' + password);

        if (!email || !password) {
            res.status(400).json({ msg: 'missing arguments.' });
            const reason = new Error('missing arguments.');
            reject(reason);
            return;
        }

        const schema = {
            email: Joi.string().regex(/^[\w-\.]+@[a-zA-Z_]+?\.+[\w-]{2,4}$/).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{8,16}$/)
        }
        let success = false;
        let userData = '';
        let error = '';
        Joi.validate(req.body, schema, (err, result) => {

            if (err) {
                error = err;
                console.log(err);
                res.json({ msg: 'an error with validation. error:' + err });
                reject(error);
                return;
            }
            success = true;
            userData = result;
            console.log(`Successfully posted data with validation. User: ${JSON.stringify(userData)}`);

        });
        if (success) {
            resolve(userData);
        } else {
            reject(error);
        }

    });

}
function createUserId(data) {
    //const id = require('crypto').createHash('sha1').update({ email: data.email, password: data.password }).digest('base64');
    const id = data.email + data.password;
    return id;

}
async function createUser(userData) {
    return new Promise((resolve, reject) => {
        console.log('function createUser');
        console.log("req.body.email: " + userData.email);
        console.log("req.body.password: " + userData.password);
        const db = connectDb();

        let insertedUserId = '';
        const userId = createUserId(userData);
        let user = { id: userId, email: userData.email, password: userData.password };

        let sql = 'INSERT INTO users SET ?';
        let query = db.query(sql, user, (err, result) => {
            if (err) {

                console.log(err);
                closeDb(db);
                reject(err);

            }
            insertedUserId = result.insertId;
            console.log("Inserted user id: " + result.insertId);
            closeDb(db);
            resolve(user.id);

        });


    });
}

const connectDb = function () {
    console.log('In function connectDB');
    db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root123",
        database: "myshows"
    });
    console.log('createConnection');
    db.connect(err => {
        if (err) {
            console.log(`Could not connect to db!.`);
            console.log(err);
            throw err;
        }
    });
    return db;
}
const closeDb = function (db) {
    console.log('in closeDb');
    db.end(function (err) {
        if (err) {
            console.log(err);
            throw err;
            res.send(err);
            res.sendStatus(500);
        }
        const msg = 'Database connection successfully closed.';
        console.log(msg);

    });
}


console.log('lets do some tests :)))');
console.log('Lets test getFavouriteShows...');
getFavouriteShows({body:{userId:'blabla@gmail.com'}})
.then(result=>{
    console.log('getFavouriteShows success !!! ',result);
},
err=>{
    console.log('ERROR IN getFavouriteShows FIX IT !!!',err);
    throw err;
});



app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))


