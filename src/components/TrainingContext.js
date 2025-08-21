import { createContext, useEffect, useReducer } from "react";

export const TrainingContext = createContext();



const initialState = {
    names: [],
  monday: [],
  thursday: [],
  saturday: [],
  sunday: [],
};


const signUp = (state, action) => {
  const { day, payload } = action;
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        [day]: payload,
      };
    case 'ADD_NAME':
      return {
        ...state,
        [day]: [...state[day], payload],
      };
    case 'REMOVE_NAME':
      return {
        ...state,
        [day]: state[day].filter((name) => name.id !== payload),
      };
    case 'EDIT_NAME':
      return {
        ...state,
        [day]: state[day].map((name) =>
          name.id === payload.id ? { ...name, text: payload.text } : name
        ),
      };
    default:
      return state;
  }
};


export const SignUpProvider = ({ children }) => {
  const [state, dispatch] = useReducer(signUp, initialState);

  useEffect(() => {
    const stored = localStorage.getItem('names');
    if (stored) {
      const parsed = JSON.parse(stored);
      dispatch({ type: 'LOAD', day: 'monday', payload: parsed.monday || [] });
      dispatch({ type: 'LOAD', day: 'thursday', payload: parsed.thursday || [] });
      dispatch({ type: 'LOAD', day: 'saturday', payload: parsed.saturday || [] });
      dispatch({ type: 'LOAD', day: 'sunday', payload: parsed.sunday || [] });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('names', JSON.stringify(state));
  }, [state]);

  return (
    <TrainingContext.Provider value={{ state, dispatch }}>
      {children}
    </TrainingContext.Provider>
  );
};
