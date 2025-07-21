// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useContext } from 'react';

const InputContext = createContext();

// eslint-disable-next-line react/prop-types
export function InputProvider({ children }) {
    const [inputValue, setInputValue] = useState('');

    return (
        <InputContext.Provider value={{ inputValue, setInputValue }}>
            {children}
        </InputContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInput() {
    return useContext(InputContext);
}