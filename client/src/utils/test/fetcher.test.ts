import { getFetcher } from '@utils/fetcher';

describe('fetcher', () => {
  const mockFetch = (data: string) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => {
        return data;
      },
    });
  };

  it('getFetcher', async () => {
    mockFetch('data from server');
    const data = await getFetcher('serverURL');
    expect(data).toBe('data from server');
  });
});
