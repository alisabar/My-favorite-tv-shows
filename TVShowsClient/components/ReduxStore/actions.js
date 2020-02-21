export const GET_FAVORITE_SHOWS = 'GET_FAVORITE_SHOWS'
export const ADD_FAVORITE_SHOW = 'ADD_FAVORITE_SHOW'
export const DELETE_FAVORITE_SHOW ='DELETE_FAVORITE_SHOW'

export function getFavorites(payload) {
    return { type: GET_FAVORITE_SHOWS, payload }
}
export function addFavorite(payload){
    return { type: ADD_FAVORITE_SHOW, payload }
}
export function deleteFavorite(payload){
    return { type: DELETE_FAVORITE_SHOW,  }
}


