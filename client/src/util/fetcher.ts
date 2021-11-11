const getFetcher = async (url: string) => {
  try {
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) return;
    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
  }
};

export { getFetcher };
