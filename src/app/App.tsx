import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ProfileProvider } from './context/ProfileContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

export default function App() {
  return (
    <SubscriptionProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </SubscriptionProvider>
  );
}