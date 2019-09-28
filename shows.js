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
    insertNewShow: function (db, newShow) {
        return new Promise(function (resolve, reject) {

            console.log("in insertNewShow");
            console.log(newShow);
            let sql1 = 'IF NOT EXISTS (SELECT * FROM shows where id ="' + newShow.id + '")' +
                'INSERT INTO shows (id, name, language, premiered, rating, imageUrl) VALUES ("' + newShow.id + '","' + newShow.name + '","' + newShow.language + '","' + newShow.premiered + '","' + newShow.rating + '","' + newShow.imageUrl + '")';
            let query1 = db.query(sql1, (err, result) => {
                if (err) {

                    reject(err);
                    // return;
                    throw err;

                }
                const showId = result;
                console.log("inserted show showId: " + showId);
                resolve('Success!');
            });
        });
    }

}
