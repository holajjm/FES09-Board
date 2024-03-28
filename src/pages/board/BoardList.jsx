import Button from "@components/Button";
import Pagination from "@components/Pagination";
import Search from "@components/Search";
import useCustomAxios from "@hooks/useCustomAxios.mjs";
import BoardListItem from "@pages/board/BoardListItem";
import { memberState } from "@recoil/user/atoms.mjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
// import { useEffect,useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

function BoardList(){
  // const [data, setData] = useState(null);
  const axios = useCustomAxios();

  // /posts?page=3
  const [searchParams, setSearchParams] = useSearchParams(); //query string을 꺼낼 때 사용

  // console.log(searchParams);
  // console.log(searchParams.get('page'));
  // console.log(searchParams.get('limit'));
  // if(!searchParams.get('page')){
  //   searchParams.set('page',1);
  //   searchParams.set('limit',10);
  //   setSearchParams(searchParams)
  // }
  
  const { data, isLoading, error,refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: () => axios.get('/posts',{params: {page: searchParams.get('page'), limit: import.meta.env.VITE_POST_LIMIT, keyword: searchParams.get('keyword')}}),
    select: response => response.data, // queryFn을 통해 받은 데이터 받기
    // staleTime: 1000*10 //query 실행 후 캐시가 유지되는 시간(default === 0)
    suspense: true,
  })
  
  useEffect(() => {
    console.log(searchParams.toString());
    refetch();
  },[searchParams.toString()])

  // 검색 요청시 주소의 query string 수정
  const handleSearch = (keyword) => {
    console.log(keyword);
    searchParams.set('keyword',keyword)
    searchParams.set('page',1)
    setSearchParams(searchParams)
  }

  const user = useRecoilValue(memberState);
  const navigate = useNavigate();
  const handleNewPost = () => {
    if(!user){
      const gotoLogin = confirm('Login First!!\n Do you want to move Login Page?');
      gotoLogin && navigate('/users/login');
    }else{
      navigate('/boards/new')
    }
  }
  // const fetchBoardList = async () => {
  //   const response = await axios.get('/posts');
  //   setData(response.data);
  // };

  // useEffect(() => {
  //   fetchBoardList();
  // }, []);

  const itemList = data?.item?.map(item => <BoardListItem key={ item._id } item={ item } />);

  return (
    <div className="min-w-80 p-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">게시물 목록 조회</h2>
      </div>
      <div className="flex justify-end mr-4">
        <Search onClick={handleSearch}/>
        <Button onClick={handleNewPost}>글쓰기</Button>
        {/* <Link className="btn btn-primary" to="/boards/new">글쓰기</Link> */}
      </div>
      <section className="p-4">
        <table className="border-collapse w-full table-fixed">
          <colgroup>
            <col className="w-[10%] sm:w-[10%]" />
            <col className="w-[60%] sm:w-[40%]" />
            <col className="w-[30%] sm:w-[15%]" />
            <col className="w-0 sm:w-[10%]" />
            <col className="w-0 sm:w-[25%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-solid border-gray-200">
              <th className="p-2 whitespace-nowrap">번호</th>
              <th className="p-2 whitespace-nowrap">제목</th>
              <th className="p-2 whitespace-nowrap">글쓴이</th>
              <th className="p-2 whitespace-nowrap hidden sm:table-cell">조회</th>
              <th className="p-2 whitespace-nowrap hidden sm:table-cell">작성일</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td>Loading...</td></tr>
            )}
            {error && (
              <tr><td>{error.message}</td></tr>
            )}
            { itemList }
          </tbody>
        </table>
            <Pagination totalPage={data?.pagination.totalPage} current={data?.pagination.page} />
        <hr/>
        
      </section>
    </div>
  );
}

export default BoardList;