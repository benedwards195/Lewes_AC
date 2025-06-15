import { createContext, useEffect, useReducer } from "react";

export const TrainingContext = createContext();

const signUp = (state, action) => {
    switch(action.type) {
        case 'LOAD':
            return action.payload;
        case 'ADD_NAME':
            return [...state, action.payload]
        case 'REMOVE_NAME':
            return state.filter((name) => name.id !== action.payload)
        case 'EDIT_NAME':
            return state.map((name) => name.id === action.payload.id ? {...name, text: action.payload.text } : name);
            default:
                return state;
    }
}

export const SignUpProvider = ({ children }) => {
     const [names, dispatch] = useReducer(signUp, []);
    
     useEffect(() => {
    const stored = localStorage.getItem('names');
    if (stored) {
      dispatch({ type: 'LOAD', payload: JSON.parse(stored) });
    }
  }, []);

    useEffect(() => {
    localStorage.setItem('names', JSON.stringify(names));
  }, [names]);

    return (
        <TrainingContext.Provider value={{ names, dispatch }} >
            {children}
        </TrainingContext.Provider>
    );
};