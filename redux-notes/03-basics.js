////////////////// Actions
// Actions are payloads of information that send data 
// from your application to your store. 
// They are the only source of information for the store. 
// You send them to the store using store.dispatch().

/*
 * action types
 */

export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * other constants
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/*
 * action creators
 */

export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function toggleTodo(index) {
  return { type: TOGGLE_TODO, index }
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}
// for big projects: http://redux.js.org/docs/recipes/ReducingBoilerplate.html


////////////////// Reducers
/*
Designing the State Shape

In Redux, all the application state is stored as a single object. 
It's a good idea to think of its shape before writing any code. 
What's the minimal representation of your app's state as an object?
*/

// Note on Relationships
// https://github.com/paularmstrong/normalizr

// Handling Actions
// reducers should be PURE!
// so, NEVER:
/*
* Mutate its arguments;
* Perform side effects like API calls and routing transitions;
* Call non-pure functions, e.g. Date.now() or Math.random().
*/
// Given the same arguments, 
// it should calculate the next state and return it. 
// No surprises. No side effects. No API calls. No mutations. 
// Just a calculation.

// * We don't mutate the state
// * We return the previous state in the default case


/// combineReducers()
// All combineReducers() does is generate a function 
// that calls your reducers with the slices of state selected according to their keys, 
// and combining their results into a single object again.

function visibilityFilter(state = VisibilityFilters.SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers } from 'redux';
const todoApp = combineReducers({
  visibilityFilter,
  todos
})



////////// Store
import { createStore } from 'redux'
let store = createStore(todoApp)

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// Dispatch some actions
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// Stop listening to state updates
unsubscribe()