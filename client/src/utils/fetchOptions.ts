interface Body {
  [Key: string]: string | string[] | null;
}

const postFetchOptions = (body: Body): RequestInit => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  };
};

const deleteFetchOptions = (): RequestInit => {
  return {
    method: 'DELETE',
    credentials: 'include',
  };
};

export { postFetchOptions, deleteFetchOptions };
