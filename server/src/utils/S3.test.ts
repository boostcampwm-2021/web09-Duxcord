import { getPresignUrl } from './S3';

describe('getPresignedUrl', () => {
  it('url이 반환된다.', async () => {
    const fileName = 'test';
    const presignUrl = await getPresignUrl(fileName);
    expect(presignUrl).toBe('url');
  });
});
