import React, { useState, useEffect } from "react";

function useTextField(initial) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    if (error) {
      setError(false);
    }
    if (event.target) {
      setValue(event.target.value.toUpperCase());
    } else {
      setValue(event.toUpperCase());
    }
  };

  return [value, error, handleChange, setError];
}

export default useTextField;
