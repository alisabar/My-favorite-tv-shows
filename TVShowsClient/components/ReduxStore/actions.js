import fetch from 'cross-fetch'
import {URL} from'../Config.js';
export const GET_FAVORITE_SHOWS = 'GET_FAVORITE_SHOWS'
export const ADD_FAVORITE_SHOW = 'ADD_FAVORITE_SHOW'
export const DELETE_FAVORITE_SHOW ='DELETE_FAVORITE_SHOW'
export const REQUEST_FAVORITE_SHOWS = 'REQUEST_FAVORITE_SHOWS'
export const RECEIVE_FAVORITE_SHOWS = 'RECEIVE_FAVORITE_SHOWS'
export const SET_USER_ID = 'SET_USER_ID'

export function getFavorites(payload) {
    return { type: GET_FAVORITE_SHOWS, payload }
}
export function addFavorite(payload){
    return { type: ADD_FAVORITE_SHOW, payload }
}
export function setUserID(payload){
    return { type: SET_USER_ID, payload }
}
export function deleteFavorite(payload){
    return { type: DELETE_FAVORITE_SHOW,  }
}
export function requestFavoriteShows(payload) {
  return {
    type: REQUEST_FAVORITE_SHOWS,
    payload
  }
}
export function receiveFavoriteShows(json) {
    if(json.error){
        return{
            type: RECEIVE_FAVORITE_SHOWS,
            error: json.error
        }
    }
  return {
    type: RECEIVE_FAVORITE_SHOWS,
    shows: json.data,
    receivedAt: Date.now()
  }
}
export function fetchShows(userId) {
  return dispatch => {
    console.log("in fetchShows. userId", userId)
    dispatch(requestFavoriteShows(userId))
    return fetch(URL.concat('/api/getMyFavouriteShows'), {
         method: 'POST',
         headers : {
           'Content-Type': 'application/json',
           'Accept': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,

          }),

       })
      .then(response => response.json())
      .then(json => dispatch(receiveFavoriteShows(json)))
  }
}