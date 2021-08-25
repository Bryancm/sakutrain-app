export const formatDate = date => {
  const d = new Date(date);
  const ye = new Intl.DateTimeFormat('en', {year: '2-digit'}).format(d);
  const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d).toUpperCase();
  const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
  const h = new Intl.DateTimeFormat('en', {hour: '2-digit', hourCycle: 'h24'}).format(d);
  const m = new Intl.DateTimeFormat('en', {minute: '2-digit'}).format(d);

  return `${da}-${mo}-${ye} ${h}:${m}`;
};
