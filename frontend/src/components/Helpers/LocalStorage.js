// Storing Items with Expiry Time in local storage

// using sessionStorage over localStorage because I want each browser tab to maintain its own storage

// duration is in ms unit.
const SetLocalStore = (key, value, duration) => {
    const now = new Date();
    const item = {
      value: value,
      exp: now.getTime() + duration,
    }

    sessionStorage.setItem(key, JSON.stringify(item));
}

const GetLocalStore = (key) => {
  const item = sessionStorage.getItem(key);
  if(!item) return null;

  const itemObj = JSON.parse(item);
  const now = new Date();
  if(now.getTime() > itemObj.exp) {
    sessionStorage.removeItem(key);
    return null;
  }

  return itemObj.value;
}

export { SetLocalStore, GetLocalStore };
