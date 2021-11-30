import { deleteFetchOptions, patchFetchOptions, postFetchOptions } from '@utils/fetchOptions';

describe('fetchOptions', () => {
  it('postFetchOptions', () => {
    const body = {
      info1: '1',
      info2: '2',
    };
    const fetchOptions = postFetchOptions(body);
    expect(fetchOptions).toEqual({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });
  });

  it('deleteFetchOptions', () => {
    const fetchOptions = deleteFetchOptions();
    expect(fetchOptions).toEqual({
      method: 'DELETE',
      credentials: 'include',
    });
  });

  it('patchFetchOptions', () => {
    const body = {
      info1: '1',
      info2: '2',
    };
    const fetchOptions = patchFetchOptions(body);
    expect(fetchOptions).toEqual({
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });
  });
});
