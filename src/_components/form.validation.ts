import { validEmail, validPhoneNo } from "../Settings/validation";

  // validators
  const required = (val: string) => {
    // using -1 as a non-selected entry for a dropdown
    return val.length === 0 || val === "-1" || val === 'undefined' || val === 'null' ? "Please enter a {name}" : "";
  };
  const textLength = (val: string, len: number) => {
    return val?.length > len ? `{name} cannot be more than ${len} characters` : "";
  };
  const numberRange = (val: number, min: number, max: number) => {
    return val < min || val > max ? `{name} must be in the range ${min} to ${max}` : "";
  };

  // validation wrappers
  const length = (len: number) => {
    return function (val: string) {
      return textLength(val, len);
    };
  };
  const isRange = (min: number, max: number) => {
    return function (val: string) {
      return numberRange(Number(val), min, max);
    };
  };
  const isValidEmail=(email:string) => {
    if(!validEmail(email)){
        return `{name} is not a valid email address`;
    }
    return "";
  }
  const isValidPhoneNo=(telNo:string) => {
    if(!validPhoneNo(telNo)){
        return `{name} is not a valid phone number`;
    }
    return "";
  }


export {
    required,
    length,
    isRange,
    isValidEmail,
    isValidPhoneNo,
}

