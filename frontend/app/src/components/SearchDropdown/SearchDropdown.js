import { useEffect, useState, useRef } from 'react'
import './search-dropdown.css';


const SearchDropdown = ({ label, placeholder, options, setChosenOption, dropdownClassName, includeNone }) => {
  // options must be array of strings - must not be null

  const [ searchQuery, setSearchQuery ] = useState('')
  const [ showDropdown, setShowDropdown ] = useState(false)
  
  // Ensure Dropdown width is set correctly
  const searchDiv = useRef(null)
  const [ searchWidth, setSearchWidth ] = useState(0)
  useEffect(() => {
    const onResize = () => {
      setTimeout(() => {
        setSearchWidth(searchDiv.current?.offsetWidth);
      }, 500)
    }
    window.addEventListener('resize', onResize);
    setSearchWidth(searchDiv.current?.offsetWidth); // Initial width
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="searchDropdownWrapper" ref={searchDiv}>
      <h3>{ label }</h3>
      <input 
        type="text" 
        className={ `${dropdownClassName}` }
        value = { searchQuery }
        onFocus={ () => setShowDropdown(true)}
        onBlur={ () => setShowDropdown(false) }
        onClick={ (e) => setSearchQuery('') }
        onChange={ (e) => setSearchQuery(e.target.value) } 
        placeholder={ placeholder }
      />
      <div 
        className="searchDropdownContent" 
        style={ {'width': searchWidth, 'display': showDropdown ? '' : 'none'} }
      >
        { includeNone &&
          <div 
          className="searchDropdownItem" 
          onMouseDown={ () => { setChosenOption(''); setSearchQuery('') } }
          >
            All
          </div>
        }
        { options?.filter((option) => {
          if (!searchQuery)
            return true
          return option.toLowerCase().includes(searchQuery.toLowerCase())
          }).map((option, i) => 
            <div 
              className="searchDropdownItem" 
              key={i} 
              onMouseDown={ () => { setChosenOption(option); setSearchQuery(option) } }
            >{option}</div>
          )
        }
      </div>
    </div>
  )
}

export default SearchDropdown;