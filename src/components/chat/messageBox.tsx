/* eslint-disable @typescript-eslint/no-explicit-any */
import useChatColorStore from '@/zustand/colors/store';
import clsx from 'clsx';

const MessageBox = ({
  text,
  created,
  userid,
  sender,
  chatName,
}: {
  text: string;
  created: string;
  userid: any;
  sender: any;
  chatName: string;
}) => {
  const { chatColor } = useChatColorStore();
  const isCurrentUser = userid === sender;

  return (
    <div
      className={clsx(
        'flex flex-col',
        isCurrentUser ? 'items-end self-end' : 'items-start self-start'
      )}
    >
      <span
        className={`text-xs font-semibold capitalize`}
        style={{ color: !isCurrentUser ? chatColor : '' }}
      >
        {isCurrentUser ? 'You' : chatName}
      </span>
      <div
        className={clsx(
          'rounded-full px-3 py-1 text-sm md:px-5 md:py-2 md:text-base'
        )}
        style={{
          backgroundColor: isCurrentUser ? chatColor : '#534b52',
        }}
      >
        <div className={clsx('w-max text-sm text-white md:text-base')}>
          <p>{text}</p>
        </div>
      </div>
      <span className="text-xs">{created.split('/')[0]}</span>
    </div>
  );
};

export default MessageBox;
