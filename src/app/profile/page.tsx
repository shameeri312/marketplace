import AddedItems from '@/components/profile/addedItems';
import Profile from '@/components/profile/profile';
import React from 'react';

const ProfilePage = () => {
  return (
    <section className="container flex flex-col gap-4 p-4 lg:flex-row">
      <AddedItems />
      <Profile />
    </section>
  );
};

export default ProfilePage;
