///////////////////////////////////////////////////
/////////////////////////////////////////////////// Motivation
///////////////////////////////////////////////////
/*
This complexity is difficult to handle as we're mixing 
two concepts that are very hard for the human mind to 
reason about: mutation and asynchronicity. 
I call them Mentos and Coke. 
Both can be great in separation, 
but together they create a mess. 
Libraries like React attempt to solve this problem in the view layer 
by removing both asynchrony and direct DOM manipulation. 
However, managing the state of your data is left up to you. 
This is where Redux enters.
*/


///////////////////////////////////////////////////
/////////////////////////////////////////////////// Core concepts
///////////////////////////////////////////////////
///////// State
// 举个栗子，一个 todo app 的 state 可以用 object 表达为：
const initialState = {
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
/*
它没有 setter，因此不会在别的地方被修改
要修改 state，必须 dispatch an action
*/



///////// Action
// 🌰
/*
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }

都带 type 字段

Enforcing that every change is described as an action lets 
us have a clear understanding of what’s going on in the app. 
If something changed, we know why it changed. 
Actions are like breadcrumbs of what has happened. 
Finally, to tie state and actions together, we write a function called a reducer.
*/



///////// Reducer
// a function that takes state and action as arguments,
// and returns the next state of the app. 
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter;
  } else {
    return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }])
    case 'TOGGLE_TODO':
      return state.map(
        (todo, index) =>
          action.index === index
            ? { text: todo.text, completed: !todo.completed }
            : todo
      )
    default:
      return state;
  }
}

// And we write another reducer that manages the complete state of 
// our app by calling those two reducers for the corresponding state keys:
function todoApp(state = initialState, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  };
}

///////////////////////////////////////////////////
/////////////////////////////////////////////////// Three Principles
///////////////////////////////////////////////////
///////// Single source of truth
// The state of your whole application is stored in an object tree within a single store.
import { createStore } from 'redux';
let store = createStore(todoApp);
console.log(store.getState());


///////// State is Read-Only
// The only way to change the state is to emit an action, 
// an object describing what happened.

let toggleTodoActionCreator = index => {
  return {
    type: 'TOGGLE_TODO',
    index
  }
}
store.dispatch(toggleTodoActionCreator(0)); // 修改index试试

let setVisibilityFilter = filter => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}
store.dispatch(setVisibilityFilter('SHOW_COMPLETED'));
console.log(store.getState())



//////// Changes are made with pure functions
// To specify how the state tree is transformed by actions, 
// you write pure reducers.
/*
Reducers are just pure functions that take the previous state and an action, 
and return the next state. 
Remember to return new state objects, 
instead of mutating the previous state. 
You can start with a single reducer, 
and as your app grows, 
split it off into smaller reducers that manage specific parts of the state tree. 
Because reducers are just functions, 
you can control the order in which they are called, 
pass additional data, 
or even make reusable reducers for common tasks such as pagination.
*/

console.log('////////////楚河汉界\\\\\\\\\\\\\\\\\\\\\\\\\\');
import { combineReducers } from 'redux';
{
  function visibilityFilter(state = initialState.visibilityFilter, action) {
    switch (action.type) {
      case 'SET_VISIBILITY_FILTER':
        return action.filter
      default:
        return state
    }
  }

  function todos(state = initialState.todos, action) {
    switch (action.type) {
      case 'ADD_TODO':
        return [
          ...state,
          {
            text: action.text,
            completed: false
          }
        ]
      case 'COMPLETE_TODO':
        return state.map((todo, index) => {
          if (index === action.index) {
            // powerful fn
            return Object.assign({}, todo, {
              completed: true
            })
          }
          return todo
        })
      default:
        return state
    }
  }

  const reducer = combineReducers({ visibilityFilter, todos });
  const store = createStore(reducer);
  store.dispatch(toggleTodoActionCreator(1));
  store.dispatch({
    type: 'ADD_TODO',
    text: 'BBQ'
  });
  console.log(store.getState());
}