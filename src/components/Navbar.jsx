import React from 'react';
import logo from '../assets/skill.png';


const Navbar = () => {
  return (
    <div className='bg-gradient-to-r from-black via-teal-950 to-black text-white w-full h-20 flex items-center px-6 sticky'>
      <div className="flex items-center">
        <img src={logo} alt="logo" className="h-14 w-auto object-contain mr-4" />
        <div className='text-2xl font-bold tracking-wide'>SKILL BARTER</div>
      </div>

      <div className='ml-auto'>
      
      <button className='bg-blue-600 text-white items-center px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300'>
          Get Started
        </button>
    
      
   
       
      </div>
    </div>
  );
}

export default Navbar;
