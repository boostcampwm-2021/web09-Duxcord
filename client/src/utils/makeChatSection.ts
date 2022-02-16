const makeChatSection = (chats: ChatData[][] | undefined) => {
  const chatSection: { [key: string]: ChatData[] } = {};
  chats
    ?.flat()
    .reverse()
    ?.forEach((chat) => {
      const day = getDay(chat['createdAt']);
      if (chatSection[day]) {
        chatSection[day].push(chat);
      } else {
        chatSection[day] = [chat];
      }
    });
  return chatSection;
};

const getDay = (targetDay: string) => {
  const date = new Date(targetDay);
  const month = ('0' + (1 + date.getMonth())).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
  return `${month}월 ${day}일 ${WEEKDAY[date.getDay()]}요일`;
};

export { makeChatSection, getDay };
