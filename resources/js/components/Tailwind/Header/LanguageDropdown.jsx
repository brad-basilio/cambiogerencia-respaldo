import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const LanguageDropdown = ({ languagesSystem, selectLanguage, onUseLanguage }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className="relative inline-flex font-Urbanist_Bold" ref={dropdownRef}>
      <button 
        className="inline-flex justify-center items-center group" 
        aria-haspopup="true"
        onClick={toggleDropdown} 
        aria-expanded={open}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M2 12C2 13.0519 2.18046 14.0616 2.51212 15M2.51212 15H11M2.51212 15C3.74763 18.4956 7.08134 21 11 21C9.45582 21 8.18412 17.4999 8.01831 13M13.0137 9H21.5015M21.5015 9C20.266 5.50442 16.9323 3 13.0137 3C14.6146 3 15.9226 6.762 16.0091 11.5M21.5015 9C21.7803 9.78867 21.9522 10.6278 22 11.5" stroke="#3E2F4D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 5.29734C2 4.19897 2 3.64979 2.18738 3.22389C2.3861 2.77223 2.72861 2.40921 3.15476 2.1986C3.55661 2 4.07478 2 5.11111 2H6C7.88562 2 8.82843 2 9.41421 2.62085C10 3.2417 10 4.24095 10 6.23944V8.49851C10 9.37026 10 9.80613 9.73593 9.95592C9.47186 10.1057 9.12967 9.86392 8.4453 9.38036L8.34103 9.30669C7.84086 8.95329 7.59078 8.77658 7.30735 8.68563C7.02392 8.59468 6.72336 8.59468 6.12223 8.59468H5.11111C4.07478 8.59468 3.55661 8.59468 3.15476 8.39608C2.72861 8.18547 2.3861 7.82245 2.18738 7.37079C2 6.94489 2 6.39571 2 5.29734Z" stroke="#3E2F4D" strokeWidth="1.5"/>
          <path d="M22 17.2973C22 16.199 22 15.6498 21.8126 15.2239C21.6139 14.7722 21.2714 14.4092 20.8452 14.1986C20.4434 14 19.9252 14 18.8889 14H18C16.1144 14 15.1716 14 14.5858 14.6209C14 15.2417 14 16.2409 14 18.2394V20.4985C14 21.3703 14 21.8061 14.2641 21.9559C14.5281 22.1057 14.8703 21.8639 15.5547 21.3804L15.659 21.3067C16.1591 20.9533 16.4092 20.7766 16.6926 20.6856C16.9761 20.5947 17.2766 20.5947 17.8778 20.5947H18.8889C19.9252 20.5947 20.4434 20.5947 20.8452 20.3961C21.2714 20.1855 21.6139 19.8225 21.8126 19.3708C22 18.9449 22 18.3957 22 17.2973Z" stroke="#3E2F4D" strokeWidth="1.5"/>
        </svg>
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm 2xl:text-base font-medium text-[#3E2F4D]">
            {selectLanguage?.name || 'Idioma'}
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            className={`transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`}
          >
            <mask id="mask0_132_2660" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_132_2660)">
              <path d="M12 15.3766L6 9.37656L7.4 7.97656L12 12.5516L16.6 7.97656L18 9.37656L12 15.3766Z" fill="#3E2F4D"/>
            </g>
          </svg>
        </div>
      </button>
      
      {open && (
        <motion.div 
          className="bg-white origin-top-right text-[#3E2F4D] z-50 absolute top-full min-w-32  border border-slate-200  py-1.5 rounded shadow-lg overflow-hidden mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <ul>
            {languagesSystem?.map((language) => (
              <motion.li 
                key={language.id}
                className="hover:bg-gray-100"
                whileHover={{ x: 2 }}
              >
                <button
                  className={`font-medium text-sm 2xl:text-base flex items-center py-1 px-3 w-full text-left ${
                    selectLanguage?.id === language.id ? 'text-[#3E2F4D] font-bold' : ''
                  }`}
                  onClick={() => {
                    onUseLanguage(language);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={`/api/lang/media/${language.image}`} 
                      alt={language.name}
                      className="h-5 w-auto object-cover rounded-none"
                    />
                    {language.name}
                  </div>
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default LanguageDropdown;