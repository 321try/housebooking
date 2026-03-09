export const formatCurrency = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    AVAILABLE: 'text-green-500',
    BOOKED: 'text-yellow-500',
    MAINTENANCE: 'text-orange-500',
    UNAVAILABLE: 'text-red-500',
    PENDING: 'text-yellow-500',
    CONFIRMED: 'text-blue-500',
    DONE: 'text-green-500',
    POSTPONED: 'text-purple-500',
    CANCELLED: 'text-red-500',
  };
  return colors[status] || 'text-gray-500';
};

export const getStatusBadgeColor = (status: string): string => {
  const colors: Record<string, string> = {
    AVAILABLE: 'bg-green-500/20 text-green-400',
    BOOKED: 'bg-yellow-500/20 text-yellow-400',
    MAINTENANCE: 'bg-orange-500/20 text-orange-400',
    UNAVAILABLE: 'bg-red-500/20 text-red-400',
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMED: 'bg-blue-500/20 text-blue-400',
    DONE: 'bg-green-500/20 text-green-400',
    POSTPONED: 'bg-purple-500/20 text-purple-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400';
};
