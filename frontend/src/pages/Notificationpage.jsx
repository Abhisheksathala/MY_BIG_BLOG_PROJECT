import React from 'react';
import axios from 'axios';
import { baseUrl } from '../App';
import { UserContext } from '../context/Usercontext';
import { Filterpagnation } from '../components/Filterpagnation';
import Loader from '../components/Loader';
import NotificationCard from '../components/NotificationCard';
import AnimationWarper from '../commone/AnimationWarper';
import Nodatamessage from '../components/Nodatamessage';
import Loadmoredata from '../components/Loadmoredata';

const Notificationpage = () => {
  const {
    userAuth: { access_token },
  } = React.useContext(UserContext);

  const [filter, setFilter] = React.useState('all');
  const [notifications, setNotifications] = React.useState(null);

  let filters = ['all', 'like', 'comment', 'replay'];

  const featchnotifications = async ({ page, deletedDocCount = 0 }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/notification/notifications`,
        { page, filter, deletedDocCount },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const data = response.data;
      if (data.success) {
        const { notifications: notificationData } = response.data;

        const formatedData = await Filterpagnation({
          data: notificationData,
          page,
          create_new_array: page === 1,
          countRoute: '/api/v1/notification/notifications-count',
          data_to_send: { filter },
          user: access_token,
          state: page === 1 ? null : notifications,
        });

        setNotifications(formatedData);
      }
    } catch (error) {
      console.log('Error in featchnotifications:', error.message);
    }
  };

  React.useEffect(() => {
    if (access_token) {
      featchnotifications({ page: 1 });
    }
  }, [filter, access_token]);

  const handlefilterFunction = (e) => {
    const btn = e.target;
    setFilter(btn.innerHTML);
    setNotifications(null);
  };

  return (
    <div className="px-3">
      <h1 className="max-md:hidden">Recent Notifications</h1>
      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => (
          <button
            key={i}
            className={`py-2 capitalize rounded-full px-4 font-medium cursor-pointer ${
              filterName === filter ? 'bg-black text-white' : 'bg-gray-200 text-black'
            }`}
            onClick={handlefilterFunction}
          >
            {filterName}
          </button>
        ))}
      </div>

      {notifications === null ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {notifications.resulte.length ? (
            notifications.resulte.map((notification, i) => (
              <div>
                <AnimationWarper key={i}>
                  <NotificationCard
                    data={notification}
                    index={i}
                    notificationState={{ notifications, setNotifications }}
                  />
                </AnimationWarper>
              </div>
            ))
          ) : (
            <Nodatamessage message={'no notifications found'} />
          )}
          <Loadmoredata
            state={notifications}
            featchdatafun={featchnotifications}
            additionalparams={{ deletedDocCount: notifications.deletedDocCount }}
          />
        </div>
      )}
    </div>
  );
};

export default Notificationpage;
