import { createStore } from 'redux';
import reducers from './index.js'; // Import root reducer

const store = createStore(reducers);

export default store;

//ended up not even using Redux lol