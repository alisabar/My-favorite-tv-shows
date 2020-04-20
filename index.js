const session = require('express-session');
const bodyParser = require('body-parser');
const express = require('express');
const shows = require('./shows');
const Joi = require('@hapi/joi');
const mysql = require('mysql');
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


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//app.use(session({
//    name: SESS_NAME,
//    resave: false,
//    saveUninitialized: false,
//    secret: SESS_SECRET,
//    cookie: {
//        maxAge: SESS_LIFETIME,
//        sameSite: true,
//        // secure: IN_PROD,
//
//    },
//    key: 'user_sid',
//
//}))

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
    console.log('getMyFavouriteShows body', req.body);
    console.log('getMyFavouriteShows user id ', req.body.userId);
    try{
        const favouritesShows = await getUserFavouriteShows(req, res);
        res.json(favouritesShows);
        console.log("favouritesShows:");
        console.log(favouritesShows);
    }
    catch{
        res.json({error:'favouriteShows doesn`t exists'});
    }

});

app.post('/api/addFavouriteShow', async (req, res) => {
    console.log('addFavouriteShow body: ', req.body);

    await insertShow(req, res);

});

app.post('/api/deleteFavouriteShow', async (req, res) => {
    console.log('deleteFavouriteShow body: ', req.body);

    await deleteShow(req, res);

});

app.post('/api/logout', (req, res) => {
    console.log('logout ', req.body);
});

app.post('/api/login', (req, res) => {

    console.log(req.body);
    (async () => {

        await loginUser(req, res);

    })();

});

app.post('/api/register', (req, res) => {

    console.log(req.body);
    (async () => {

        await registerUser(req, res);

    })();
});

async function getUserFavouriteShows(req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const favouriteShows = await getFavouriteShows(req, res);
            if (!favouriteShows) {

                console.log('favouriteShows doesn`t exists');

                reject("favouriteShows doesn`t exists");
                return;
            }

            let myFavourites = favouriteShows.map(item => {

                var rObj = {};
                rObj["name"] = item.name ? item.name : '';
                rObj["id"] = item.id ? item.id : '';
                rObj["language"] = item.language ? item.language : '';
                rObj["premiered"] = item.premiered ? item.premiered : '';
                rObj["rating"] = item.rating ? item.rating : '';
                rObj["imageUrl"] = item.imageUrl ? item.imageUrl : '';
                rObj["genres"] = item.genre ? item.genre.split(",") : [];
                return rObj;
            });
            //console.log("favouriteShows: \n",favouriteShows);
            console.log("myFavourites: \n", myFavourites);
            resolve({data:myFavourites});


        }
        catch (error) {
            console.log('Catched this in getUserFavouriteShows', error);
            //console.log(error.message);
            res.sendStatus(500);
        }
    });
}

async function getFavouriteShows(req, res) {
    return new Promise((resolve, reject) => {
        const db = connectDb();
        const user_id = req.body.userId;
        console.log("in getFavouriteShows user id: " + user_id);

        let sql = `select  shows.id ,shows.name, shows.language, shows.premiered , shows.rating, shows.imageUrl ,
                  GROUP_CONCAT(genresshows.genre) as genre
                  from genresshows join shows
                  where genresshows.showId = shows.id and genresshows.showId in
                    (select shows.id as id
                    from shows
                    where shows.id in
                        (select showId
                        from usershow
                         where userId = '${user_id}' )) GROUP BY shows.name`;

        db.query(sql, (err, result) => {
            if (err) {
                closeDb(db);
                reject(err);

            }

            console.log("Json Favourites :\n" + JSON.stringify(result));
            closeDb(db);
            resolve(result);
        });


    });

}

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


async function deleteShow(req, res) {
  return new Promise(async (resolve, reject) => {
        try {
            console.log("In deleteShow");
            const db = connectDb();
            const userId = req.body.userId;
            const showName = req.body.name;
            const showId = await shows.getShowIdByName(db, showName);
            console.log("showId: ", showId);
            await shows.deleteFavoriteShow(db, showId, userId);
            closeDb(db);
            res.json({msg:"Deleted"});
        }
        catch (error) {
            console.log('Cought this:', error);
            console.log(error.message);
            res.json({msg: error.message});
        }
  });
}

async function insertShow(req, res) {
    return new Promise(async (resolve, reject) => {
        try {

            console.log("In insertShow");
            const db = connectDb();
            const myShow = req.body;
            const userId = myShow.userId;
            console.log("userId: ", userId);
            const receivedShow = {
                name: myShow.name,
                language: myShow.language,
                premiered: myShow.premiered,
                rating: myShow.rating,
                imageUrl: myShow.imageUrl
            };
            const isDate = await checkDate(receivedShow.premiered)
            console.log("isDate");
            console.log(isDate)
            if(!isDate){
                receivedShow.premiered = null;
            }

            const newShow = {

                name: myShow.name.slice(1, myShow.name.length - 1),
                language: myShow.language.slice(1, myShow.language.length - 1),
                premiered: receivedShow.premiered!='null' ? receivedShow.premiered.slice(1, receivedShow.premiered.length - 1) : '0000-00-00 00:00:00',
                rating: !myShow.rating ? 0 : myShow.rating,
                imageUrl: myShow.imageUrl.slice(1, myShow.imageUrl.length - 1),

            };

            newShow.id = require("crypto")
                        .createHash("sha256")
                        .update(newShow.name.concat(newShow.premiered).concat(newShow.rating))
                        .digest("hex");

            await shows.insertNewShow(db, newShow);
            await shows.insertNewUserShow(db, newShow, userId);
            await shows.insertGenres(db, newShow, myShow);
            closeDb(db);
            newShow.genres = myShow.genres ? JSON.parse(myShow.genres) : ''

            res.json({show: newShow});

            resolve('success');
        }
        catch (error) {
            console.log('Cought this:', error);
            console.log(error.message);
            reject(error);
            res.sendStatus(500);
        }


    });

}
async function checkDate(resDate){
    try{
        const validation = await validateDate(resDate);
        if(validation){
            return true
        }
    }
    catch(err){
        console.log(err);
        return false;
    }
}


async function validateDate(resDate){
    return new Promise((resolve, reject) => {
        console.log("checking the date");
        const d = new Date(resDate);
        console.log(d.getDate());
        if(d.getDate()=='NaN'){
            reject("Not a Date");
        }
        else resolve(true);
    });
}
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
            if (result.insertId) {
                insertedUserId = result.insertId;
                console.log("Inserted user id: " + result.insertId);
            }


            closeDb(db);
            resolve(user.id);

        });


    });
}


//console.log('lets do some tests :)))');
//console.log('Lets test getFavouriteShows...');
//getUserFavouriteShows({body:{userId:'lala@la.lalalala12'}})
//.then(result=>{
//    console.log('getFavouriteShows success !!! ',result);
//},
//err=>{
//    console.log('ERROR IN getFavouriteShows FIX IT !!!',err);
//    throw err;
//});

//
//console.log('Lets test addFavouriteShow...');
//let fakeFavShow={
//userId: 'lala@la.lalalala12',
// id: 'Funy GirlsEnglish',
//  name: '"Funy Girls"',
//  language: '"English"',
//  premiered: '"2017-09-05"',
//  rating: '6.3',
//  imageUrl:
//   '"http://static.tvmaze.com/uploads/images/medium_portrait/137/344365.jpg"',
//   genres : '["Comedy","Drama"]'
//};
//
//function FakeResponse(){
//    this.send=function() {
//        console.log('mock send was called!',arguments);
//    }
//
//    this.json=function(){
//            console.log('mock json was called!',arguments);
//        }
//
//}
//
//insertShow({body:fakeFavShow} , new FakeResponse())
//.then(result=>{
//    console.log('insertShow success!!!!',result);
//},error=>{
//    console.log('insertShow error',error);
//    throw error;
//});


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))


