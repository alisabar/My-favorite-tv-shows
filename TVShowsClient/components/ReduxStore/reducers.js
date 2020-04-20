import { GET_FAVORITE_SHOWS, ADD_FAVORITE_SHOW, DELETE_FAVORITE_SHOW, REQUEST_FAVORITE_SHOWS, RECEIVE_FAVORITE_SHOWS, SET_USER_ID } from './actions'

export const initialState = {
  isFetching: false,
  error: '',
  userId: '',
  lastUpdated: '',
  favoriteShows: [

  ]
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_FAVORITE_SHOWS:
      return Object.assign({}, state, {
        isFetching: true,

      })
    case RECEIVE_FAVORITE_SHOWS:
      return Object.assign({}, state, {
        isFetching: false,
        favoriteShows: action.shows,
        lastUpdated: action.receivedAt
      })
    case SET_USER_ID:
      return Object.assign({}, state, {
        userId: action.payload,

      })
    case DELETE_FAVORITE_SHOW:
      return {
        ...state,
        favoriteShows: state.favoriteShows.filter((show) => show.id !== action.payload)
      }
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

