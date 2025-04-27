import Profile from '@/components/profile/profile';
import React from 'react';

const ProfilePage = () => {
  return (
    <section className="container flex flex-col gap-4 p-4 md:flex-row md:gap-2">
      <Profile />
    </section>
  );
};

export default ProfilePage;
