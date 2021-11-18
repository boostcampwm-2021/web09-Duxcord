export const getURLParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const groupID = searchParams.get('group');
  const channelType = searchParams.get('type');
  const channelID = searchParams.get('id');

  return { groupID, channelType, channelID };
};
