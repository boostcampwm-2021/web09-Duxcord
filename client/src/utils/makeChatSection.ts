const makeChatSection = (chats: any[] | undefined) => {
  const chatSection: { [key: string]: any } = {};
  chats?.flat()?.forEach((chat) => {
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

  const WEEKDAY = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return `${month}월 ${day}일 ${WEEKDAY[date.getDay()]}`;
};

export { makeChatSection };
