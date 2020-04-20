const request = require('request');
const express = require('express');


async function asyncQuery(db, sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {

            if (err) {
                reject(err);
            } else {
                resolve(result);
            }

        });
    });
}

module.exports = {
    randomShows: function (res) {
        var headers = {
            'Content-Type': 'application/json'
        }
        // Configure the request
        var options = {
            url: 'http://api.tvmaze.com/search/shows?q=girls',
            method: 'GET',
            headers: headers,
        }

        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('Server error at randomShows.');
                console.log("randomShows error: " + error);
            }
        })
    },
    searchShows: function (res, searchParam) {
        console.log("at search shows. searchParam: " + searchParam)
        var headers = {
            'Content-Type': 'application/json'
        }
        // Configure the request
        var options = {
            url: 'http://api.tvmaze.com/search/shows?q=' + searchParam,
            method: 'GET',
            headers: headers,
        }

        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).json({ msg: 'Server error at searchShows.' });
                console.log("searchShows error: " + error + "\n statusCode" + response.statusCode);
            }
        })
    },
    getShowById: function (db, id) {
        console.log("in getShowById");
        let sql = `SELECT * FROM shows WHERE id = '${id}'`;

        return db.query(sql, (err, result) => {
            if (err) throw err;
            console.log("resShow: " + result);
            resShow = result;
            return result;
        });

    },
    getShowId: function (show) {
        //const id = require('crypto').createHash('sha1').update({ name: show.name, lang: show.language }).digest('base64');
        const id = show.name + show.language;
        return id;
    },
    getShowIdByName: function (db, showName) {
        return new Promise(function (resolve, reject) {

            console.log("in getShowIdByName");
            let sql = `SELECT id FROM shows WHERE name = ${showName}`;

            console.log(sql);
            let query = db.query(sql, (err, result) => {
                if (err) {

                    reject(err);
                    throw err;

                }
                resolve(result);
            });
        });
    },
    deleteFavoriteShow: function (db, showId, userId) {
        return new Promise(function (resolve, reject) {

            console.log("in deleteFavoriteShow");
            console.log(showId[0].id);
            console.log(userId);
            let sql = 'DELETE FROM usershow WHERE ShowId ="' + showId[0].id + '" AND userId= "' + userId + '";';
            console.log(sql);
            let query = db.query(sql, (err, result) => {
                if (err) {

                    reject(err);
                    throw err;

                }

                resolve('Successfully deleted!');
            });
        });
    },
    insertNewShow: function (db, newShow) {
        return new Promise(function (resolve, reject) {

            console.log("in insertNewShow");
            console.log(newShow);

            let sql1 = 'INSERT INTO shows (id, name, language, premiered, rating, imageUrl)' +
                'SELECT "' + newShow.id + '" ,"' + newShow.name + '" ,"' + newShow.language + '" ,"' + newShow.premiered + '" ,' + newShow.rating + ' ,"' + newShow.imageUrl + '" ' +
                'WHERE NOT EXISTS (SELECT * FROM shows WHERE id = "' + newShow.id + '");'
            console.log(sql1);
            let query1 = db.query(sql1, (err, result) => {
                if (err) {

                    reject(err);
                    throw err;

                }
                const showId = result;
                console.log("inserted show showId: " + showId);
                resolve('Success!');
            });
        });
    },
    insertNewUserShow: function (db, newShow, userId) {
        return new Promise(function (resolve, reject) {
            let userShowSql = 'INSERT INTO userShow (userId, showId)' +
                'SELECT "' + userId + '","' + newShow.id + '" ' +
                'WHERE NOT EXISTS (SELECT * FROM userShow WHERE userId = "' + userId + '" and showId = "' + newShow.id + '");\r\n';
            console.log(userShowSql);
            let SqlQuery = db.query(userShowSql, (err, result) => {
                if (err) {

                    reject(err);
                    throw err;

                }
                const showId = result;
                console.log("inserted usershow row id: " + showId);
                resolve('Success!');
            });

        })
    },
    insertGenres: function (db, newShow, myShow) {
        return new Promise(function (resolve, reject) {
            let genres = null;
            if (myShow.genres && (genres = JSON.parse(myShow.genres))) {
                genres.forEach(async genre => {
                    console.log('genre: ' + genre);
                    genreField = genre;
                    let genreSql = 'INSERT INTO genres (name) SELECT "' + genre + '" WHERE NOT EXISTS (SELECT * FROM genres WHERE name = "' + genre + '");';
                    let genreShowSql = 'INSERT INTO genresShows (genre , showId) SELECT "' + genre + '","' + newShow.id + '" ' +
                        'WHERE NOT EXISTS (SELECT * FROM genresShows WHERE genre = "' + genre + '" and showId = "' + newShow.id + '");';
                    try {
                        await asyncQuery(db, genreSql);
                        await asyncQuery(db, genreShowSql);
                    }
                    catch (err) {
                        console.log(err);
                        reject(err);
                    }

                    resolve('success')
                });
            }
        });
    }

}
