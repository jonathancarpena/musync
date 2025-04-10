export const openCloseVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -20 },
};

export const formatDate = (dateReceived: Date) => {
  const date = new Date(dateReceived);
  const results = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return results;
};
