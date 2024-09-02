const getField = (param: string, object: { [x: string]: any }): any => {
  if (param in object) {
    return object[param];
  } else {
    return null;
  }
};

export default getField;
