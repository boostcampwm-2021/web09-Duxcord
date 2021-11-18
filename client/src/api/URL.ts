export const URL = {
  loginPage: '/',
  groupPage: (groupID: number | undefined = undefined) =>
    groupID ? `/main?group=${groupID}` : '/main',
  channelPage: (groupID: number | undefined, channelType: string, id: number) =>
    `/main?group=${groupID}&type=${channelType}&id=${id}`,
};
