const saveItem = (key: string, value: { mic: boolean; speaker: boolean; cam: boolean }) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const loadItem = (key: string) => {
  const data = sessionStorage.getItem(key);

  return data ? JSON.parse(data) : null;
};

export { saveItem, loadItem };
