import { CITY_SET } from '../actionTypes'
const defaultState = {
  cityName: 'xxx...'
}
export default (state = defaultState, action) => {
  const {type, value} = action
  let newState = JSON.parse(JSON.stringify(state))
  switch (type) {
    case CITY_SET:
    newState.cityName = value
    return newState
    default:
    break
  }
  return state
}