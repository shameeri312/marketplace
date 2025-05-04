import React from 'react';
import { Text } from '../ui/text';

const Loading = () => {
  return (
    <div className="w-full text-center">
      <Text as="span" className="mx-auto animate-ping !text-primary">
        Loading...
      </Text>
    </div>
  );
};

export default Loading;
