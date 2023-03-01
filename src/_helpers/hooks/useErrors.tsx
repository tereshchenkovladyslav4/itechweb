import React, { useState } from "react";

interface Errors {
  hasError: (val: string) => boolean;
  hasErrors: () => boolean;
  getErrors: (val: string) => any;
  getAllErrors: () => any[];
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  setErrors: (val: any) => void;
  clearErrors: () => void;
  // errors: any;
}
// [
//     hasError:(val: string) => boolean,
//     getErrors:(val: string) => any,
//     setError:(field: string, error: string) => void,
//     clearError:(field: string) => void,
//     setErrors:(val:any) => void
// ]
const useErrors = (): Errors => {
  const [errors, setErrors] = useState<any>({});

  const clearErrors = () => {
    setErrors({});
  };

  const getErrors = (val: string): any =>
    hasError(val) ? (
      <span>
        {errors[val]?.map((x: string, i: number) => (
          <span key={i}>
            &bull; {x}
            <br />
          </span>
        ))}
      </span>
    ) : null;

  const hasError = (val: string): boolean => {
    const isError = errors[val]?.length > 0;
    return isError;
  };

  const hasErrors = (): boolean => {
    return Object.keys(errors).filter((x) => errors[x].length > 0).length > 0;
  };

  const getAllErrors = (): any[] => {
    return Object.keys(errors)
      ?.filter((x) => errors[x].length > 0 && isNaN(Number(x)))
      ?.map((key: string) => <span key={key}>{errors[key]}</span>);
  };

  const setError = (field: string, error: string) => {
    setErrors((prev: any) => {
      const err = prev[field];
      if (err) {
        err.push(error);
        return { ...prev, ...err };
      } else {
        const fieldError = {
          [field]: [error],
        };
        return { ...prev, ...fieldError };
      }
    });
  };

  const clearError = (field: string) => {
    const fieldError = {
      [field]: [],
    };
    setErrors((prev: any) => ({ ...prev, ...fieldError }));
  };

  return {
    hasError,
    getErrors,
    setError,
    clearError,
    setErrors,
    hasErrors,
    getAllErrors,
    clearErrors,
  };
};

export default useErrors;
