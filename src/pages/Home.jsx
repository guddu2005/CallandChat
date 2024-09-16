import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faUser, faCalendar, faCog, faExclamationTriangle, faBars } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { RiCloseLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const images = [
        "https://www.beyondtoday.blog/uploads/6/4/1/3/6413585/mentormentee_orig.jpg",
        "https://engineering.purdue.edu/Engr/Academics/Graduate/Events/mentorship-training-for-postdocs2/mentorandmentee.jpg",
        "https://allianceofbwa.org/wp-content/uploads/2023/02/Mentoring-photo.jpg",
        "https://akpsi.org/wp-content/uploads/2020/02/AdobeStock_204515070-scaled.jpeg"
    ];

    return (
        <div className='bg-gray-50'>
            <header className='flex justify-between items-center bg-gray-200 p-5'>
                <div className='flex items-center'>
                    <img src="http://surl.li/nghbzi" alt="logo" className='h-16' />
                    <p className='text-5xl font-bold ml-3 mt-2'>Meet</p>
                </div>
                <div className='hidden lg:flex lg:justify-around  '>
                    <p className='text-3xl font-semibold'>Date and Time Year</p>
                </div>
                <div className='hidden lg:flex lg:justify-between w-1/5 items-center'>
                    <FontAwesomeIcon icon={faCalendar} size="2x" color="black" className='cursor-pointer' />
                    <FontAwesomeIcon icon={faQuestionCircle} size="2x" className='cursor-pointer' />
                    <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className='cursor-pointer' />
                    <FontAwesomeIcon icon={faCog} size="2x" color="black" className='cursor-pointer' />
                    <FontAwesomeIcon icon={faUser} size="2x" color="black" className='cursor-pointer' />
                </div>
                {/* Hamburger Icon */}
                <div className='lg:hidden flex items-center'>
                    <FontAwesomeIcon
                        icon={faBars}
                        size="2x"
                        color="gray"
                        className='cursor-pointer'
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    />
                </div>
            </header>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className='lg:hidden fixed top-0 left-0 w-full h-full bg-gray-200 flex flex-col items-center justify-center z-50'>
                    <RiCloseLine
                        size="1.5rem" // Adjusted size for the close button
                        color="gray"
                        className='absolute top-5 right-5 cursor-pointer'
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className='flex flex-col items-center space-y-6'>
                        <p className='text-xl font-semibold hover:text-gray-700'>Date and Time Year</p>
                        <FontAwesomeIcon icon={faCalendar} size="2x" color="gray" className='cursor-pointer hover:text-gray-700' />
                        <FontAwesomeIcon icon={faQuestionCircle} size="2x" color="gray" className='cursor-pointer hover:text-gray-700' />
                        <FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="gray" className='cursor-pointer hover:text-gray-700' />
                        <FontAwesomeIcon icon={faCog} size="2x" color="gray" className='cursor-pointer hover:text-gray-700' />
                        <FontAwesomeIcon icon={faUser} size="2x" color="gray" className='cursor-pointer hover:text-gray-700' />
                    </div>
                </div>
            )}
            <main>
                <section>
                    <Carousel
                        infiniteLoop
                        useKeyboardArrows
                        autoPlay
                        showStatus={false}
                        showThumbs={false}
                        showIndicators={false}
                        dynamicHeight
                        className='z-10'
                    >
                        {images.map((src, index) => (
                            <div key={index}>
                                <img src={src} alt={`Slide ${index + 1}`} className='h-96 w-screen ' />
                            </div>
                        ))}
                    </Carousel>
                </section>
                <section className='p-10'>
                    <p className='text-5xl m-2'>Videos Calls and meetings for everyone</p>
                    <p className='text-2xl m-2'>Connect with your Mentor and Mentees with <b>Mentor Meet</b></p>
                    <button className='border m-2  shadow-md p-2 rounded bg-blue-400 hover:bg-blue-700'>
                        New Meeting
                    </button>
                    <Link to="/lobby">
                        <button  className='border m-2  shadow-md p-2 rounded bg-blue-400 hover:bg-blue-700'>Join Meeting</button>
                    </Link>
                </section>
            </main>
        </div>
    );
}
