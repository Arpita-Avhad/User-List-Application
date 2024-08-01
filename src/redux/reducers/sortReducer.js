
const initialState = {
    key: 'id',
    direction: 'asc',
  };
  
  const sortReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_SORT':
        return {
          ...state,
          key: action.payload.key,
          direction: action.payload.direction,
        };
      default:
        return state;
    }
  };
  
  export default sortReducer;
  