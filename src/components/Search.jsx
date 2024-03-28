import Submit from "@components/Submit"
import { useState } from "react"
import PropTypes from 'prop-types'

Search.propTypes = {
  onClick: PropTypes.func
}

function Search({onClick}) {
  const [keyword, setKeyword] = useState('');
  const handlechange = (e) => {
    setKeyword(e.target.value);
  }

  return (
    <form >
      <input className="dark:bg-gray-500" type="text" autoFocus value={keyword} onChange={handlechange}/>
      <Submit onClick={(e) => {e.prevernDefault(); onClick(keyword);} }>Search</Submit>
    </form>
  )
}

export default Search