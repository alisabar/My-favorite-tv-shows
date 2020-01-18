const request = require('request');
const express = require('express');

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
    getShowIdByName: function(db, showName){
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
    deleteFavoriteShow: function(db, showId, userId){
        return new Promise(function (resolve, reject) {

                console.log("in deleteFavoriteShow");
                let sql = `DELETE FROM usershow WHERE ShowId = ${showId} AND userId= ${userId}`;
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

                let sql1 ='INSERT INTO shows (id, name, language, premiered, rating, imageUrl)'+
                'SELECT "' + newShow.id + '" ,"' + newShow.name + '" ,"' + newShow.language + '" ,"' + newShow.premiered + '" ,"' + newShow.rating + '" ,"' + newShow.imageUrl + '" '+
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
    }

}
