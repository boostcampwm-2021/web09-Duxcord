export const URL = {
  LOGIN: '/',
  GROUP: (groupID: number | undefined = undefined) =>
    groupID ? `/main?group=${groupID}` : '/main',
  CHANNEL: (groupID: number | undefined, channelType: string, id: number) =>
    `/main?group=${groupID}&type=${channelType}&id=${id}`,
};
