export const formatMoney = (value: number): string => {
  const formatter = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD'
  });
  return formatter.format(value || 0);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
