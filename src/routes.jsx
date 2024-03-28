// route를 통해 경로 설정
import Layout from '@components/Layout/Layout';
import BoardDetail from '@pages/board/BoardDetail';
import BoardList from '@pages/board/BoardList';
import BoardNew from '@pages/board/BoardNew';
// import BoardResult from '@pages/board/BoardResult';
import RelpyList from '@pages/board/RelpyList';
import Login from '@pages/user/Login';
import Signup from '@pages/user/Signup';
import {createBrowserRouter} from 'react-router-dom';

const router = createBrowserRouter([
  // define routing rules
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <BoardList />
      },
      {
        path: "/boards",
        element: <BoardList />
      },
      {
        path: "/boards/:_id",
        element: <BoardDetail />,
        children: [{
          index: true,
          element: <RelpyList />
        }]
      },
      {
        path: "/boards/new",
        element: <BoardNew />
      },
      // {
      //   path: "/boards/:_id/result",
      //   element: <BoardResult />
      // },
      {
        path: "/users/login",
        element: <Login />
      },
      {
        path: "users/signup",
        element: <Signup />
      }
    ]
  },
]);

export default  router;