const uploadFileWithPresignedUrl = async (url: string, file: File) => {
  try {
    const response = await fetch(
      new Request(url, {
        method: 'PUT',
        credentials: 'include',
        body: file,
        headers: new Headers({
          'x-amz-acl': 'public-read',
        }),
      }),
    );
    return response.url;
  } catch (err) {
    console.log(err);
  }
};

export { uploadFileWithPresignedUrl };
