const defaultState = {fetching: false, fetched: false, failed: false, payload: null, errorMessage: null}

export function registerFetchNames (store, ...names) {
  names.forEach(name => {
    store.state[name] = defaultState
  
    store.getters[name] = state => state[name]
  
    store.mutations[`set_${name}_fetching`] = 
      (state) => state[name] = {...defaultState, fetching: true}
  
    store.mutations[`set_${name}_fetched`] =
      (state, payload) => state[name] = {...defaultState, fetched: true, payload}
  
    store.mutations[`set_${name}_error`] =
      (state, error) => state[name] = {...defaultState, failed: true, errorMessage: error}
  
    store.mutations[`set_${name}_clear`] =
      (state) => state[name] = defaultState
  })
}

export async function doFetch (commit, actionName, fetchPromise, transformFunc) {
  commit(`set_${actionName}_fetching`)
  try {
    let result = await fetchPromise
    if (transformFunc) {
      result = transformFunc(result)
    }
    commit(`set_${actionName}_fetched`, result)
  }
  catch (err) {
    commit(`set_${actionName}_error`, err.message)
  }
}

export async function fetchClear (commit, actionName) {
  commit(`set_${actionName}_clear`)
}