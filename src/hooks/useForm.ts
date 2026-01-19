import { useState, useEffect, useCallback } from 'react';

type ValidateFunction<T> = (values: T) => Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, any>>(initialValues: T, validate: ValidateFunction<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>(() => validate(initialValues));
  const [isValid, setIsValid] = useState(() => Object.keys(validate(initialValues)).length === 0);

  const handleChange = useCallback((name: keyof T, value: string) => {
    setValues(prev => {
      const nextValues = { ...prev, [name]: value };
      return nextValues;
    });
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [values, validate]);

  return { values, errors, touched, handleChange, handleBlur, isValid };
}
