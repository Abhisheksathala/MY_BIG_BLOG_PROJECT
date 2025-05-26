export const storeInSession = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

export const lookInSession = (key) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const removeFromSession = (key) => {
  localStorage.removeItem(key);
};

export const logOutUser = () => {
  localStorage.clear();
};
