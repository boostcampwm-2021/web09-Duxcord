const saveItem = (key: string, value: { mic: boolean; speaker: boolean; cam: boolean }) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadItem = (key: string) => {
  const data = localStorage.getItem(key);

  return data && JSON.parse(data);
};

export { saveItem, loadItem };
