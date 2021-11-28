const getBrowser = () => {
  const agent = navigator.userAgent.toLowerCase();
  if (agent.indexOf('chrome') !== -1) return 'Chrome';
  if (agent.indexOf('opera') !== -1) return 'Opera';
  if (agent.indexOf('staroffice') !== -1) return 'Star Office';
  if (agent.indexOf('webtv') !== -1) return 'WebTV';
  if (agent.indexOf('beonex') !== -1) return 'Beonex';
  if (agent.indexOf('chimera') !== -1) return 'Chimera';
  if (agent.indexOf('netpositive') !== -1) return 'NetPositive';
  if (agent.indexOf('phoenix') !== -1) return 'Phoenix';
  if (agent.indexOf('firefox') !== -1) return 'Firefox';
  if (agent.indexOf('safari') !== -1) return 'Safari';
  if (agent.indexOf('skipstone') !== -1) return 'SkipStone';
  if (agent.indexOf('netscape') !== -1) return 'Netscape';
  if (agent.indexOf('mozilla/5.0') !== -1) return 'Mozilla';
  if (agent.indexOf('msie') !== -1) return 'Internet Explorer';
  else return 'unknown browser';
};

export { getBrowser };
