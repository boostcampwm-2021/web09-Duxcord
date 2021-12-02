const AWS = {
  Endpoint: () => 'endpoint',
  S3: () => ({
    getSignedUrlPromise: (op, obj = {}) => {
      return Promise.resolve('url');
    },
  }),
};

export default AWS;
