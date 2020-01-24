import {GET_FAVORITE_SHOWS, ADD_FAVORITE_SHOW, DELETE_FAVORITE_SHOW} from './actions'

const initialState = {
    favoriteShows: [

    ]
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_FAVORITE_SHOW:
      return {
           ...state,
           favoriteShows: state.favoriteShows.filter((show) => show.id !== action.payload)
      }
    case GET_FAVORITE_SHOWS:
       return Object.assign({}, state, {
            favoriteShows: action.payload

      })
    case ADD_FAVORITE_SHOW:
        return Object.assign({}, state, {
             favoriteShows: [
                   ...state.favoriteShows,
                   {
                     id: action.payload.id,
                     name: action.payload.name,
                     language: action.payload.language,
                     rating: action.payload.rating,
                     premiered: action.payload.premiered,
                     imageUrl: action.payload.imageUrl,
                     genres: action.payload.genres
                   }
             ]

        })
    default:
      return state
  }
}
export default rootReducer;

