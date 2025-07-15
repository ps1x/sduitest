import { http, HttpResponse, delay } from 'msw'

// 1. Mock for the main SDUI layout
const sduiLayoutHandler = http.get('/api/sdui-layout', async () => {
  // Simulate a network delay
  await delay(1500);
  return HttpResponse.json({
    components: [
      {
        // Add a unique ID for each component instance
        id: 'user-profile-1',
        type: 'UserProfile',
        props: { userId: 1 },
      },
      {
        id: 'stock-aapl',
        type: 'StockTicker',
        props: { symbol: 'AAPL' },
      },
      {
        id: 'user-profile-2',
        type: 'UserProfile',
        props: { userId: 2 },
      },
    ],
  });
});

// 2. Mock for fetching user data
const userHandler = http.get('/api/users/:userId', async ({ params }) => {
  const { userId } = params;
  const users = {
    1: { name: 'Alice', email: 'alice@example.com' },
    2: { name: 'Bob', email: 'bob@example.com' },
  };
  
  const componentDelay = userId === '1' ? 800 : 1200;
  await delay(componentDelay);

  return HttpResponse.json(users[userId] || { name: 'User not found' });
});

// 3. Mock for fetching stock data
const stockHandler = http.get('/api/stocks/:symbol', async ({ params }) => {
  const { symbol } = params;
  const price = (Math.random() * (150 - 140) + 140).toFixed(2);

  await delay(1000);

  return HttpResponse.json({ symbol, price });
});


export const handlers = [sduiLayoutHandler, userHandler, stockHandler];
