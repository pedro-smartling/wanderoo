import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const GetStarted = () => {
  const navigate = useNavigate();
  const [isSliding, setIsSliding] = useState(false);

  const handleContinueAsGuest = () => {
    setIsSliding(true);
    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate('/discover');
    }, 500);
  };

  const handleSignIn = () => {
    // Placeholder - button won't work as requested
    console.log('Sign in clicked - not implemented');
  };

  const handleCreateAccount = () => {
    // Placeholder - button won't work as requested
    console.log('Create account clicked - not implemented');
  };

  return (
    <div className={`relative h-full w-full transition-transform duration-500 ease-in-out ${isSliding ? 'transform translate-y-full' : 'transform translate-y-0'}`}>
      {/* Video/Image Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Fallback background image - only shows if video fails */}
        <div 
          id="fallback-bg"
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='800' viewBox='0 0 400 800'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2387CEEB;stop-opacity:1' /%3E%3Cstop offset='70%25' style='stop-color:%2398FB98;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2390EE90;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='800' fill='url(%23bg)'/%3E%3Ccircle cx='320' cy='80' r='40' fill='%23FFD700'/%3E%3Crect x='50' y='600' width='300' height='200' rx='20' fill='%2332CD32'/%3E%3Crect x='150' y='450' width='100' height='150' fill='%23CD853F'/%3E%3Crect x='100' y='400' width='200' height='50' rx='25' fill='%23FF6B35'/%3E%3Ccircle cx='200' cy='400' r='8' fill='%23FFF'/%3E%3Cpath d='M80 500 Q200 350 320 500' stroke='%23228B22' stroke-width='4' fill='none'/%3E%3Ccircle cx='100' cy='300' r='30' fill='%23FFB6C1'/%3E%3Ccircle cx='300' cy='250' r='25' fill='%2387CEFA'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Video element */}
        <video
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: -1 }}
          onLoadedData={() => {
            console.log('Video loaded successfully');
            // Hide fallback background when video loads
            const fallback = document.getElementById('fallback-bg');
            if (fallback) fallback.style.display = 'none';
          }}
          onError={(e) => {
            console.error('Video failed to load:', e);
            const target = e.target as HTMLVideoElement;
            target.style.display = 'none';
          }}
          onCanPlay={() => {
            console.log('Video can play');
          }}
        >
          <source src="/videos/kids-playing-outdoors.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(164.34% 182.26% at 165.47% 165.52%, rgba(255, 166, 123, 0.8) 0%, rgb(32 32 32 / 39%) 100%)'
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center justify-between px-6 py-12">
        {/* Top spacer */}
        <div className="flex-1"></div>
        
        {/* Wanderoo Logo */}
        <div className="flex items-center justify-center">
          <div className="w-[231px] h-[49px]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 231 49"
            >
              <g>
                <g>
                  <path
                    d="M0 17.0194C0 7.61984 7.61984 0 17.0194 0H31.0354C40.4349 0 48.0547 7.61984 48.0547 17.0194V31.0354C48.0547 40.4349 40.4349 48.0547 31.0354 48.0547H17.0194C7.61984 48.0547 0 40.4349 0 31.0354V17.0194Z"
                    fill="white"
                  />
                  <path
                    clipRule="evenodd"
                    d="M14.1684 10.9643C12.0547 11.7001 10.0513 13.9523 8.82276 16.9735C8.61094 17.4944 8.48146 17.9285 8.47715 17.9516C8.04511 20.2604 10.7481 20.0794 11.4671 18.7424C12.1862 17.4054 11.9359 17.9337 12.4454 16.9454C13.0168 15.8373 13.5599 14.9581 13.8622 14.6522C14.2932 14.2157 14.4192 14.1558 14.9055 14.1558C15.6531 14.1558 15.9499 14.45 15.9499 15.1907C15.9499 16.2172 15.0551 18.3566 13.4573 21.1503C11.0006 25.4452 9.46902 28.7823 9.05939 30.7322C8.76833 32.1179 8.76563 32.7232 9.04588 33.7164C9.56473 35.5543 11.1885 36.892 13.2225 37.157C14.689 37.3481 17.1418 36.4726 19.6342 34.8684L20.8427 34.0905L21.1141 34.7103C22.0044 36.7432 23.4023 38.084 25.1563 38.587C26.1484 38.8714 27.8485 38.8392 28.8903 38.5161C33.8171 36.9887 38.3412 29.2068 39.8949 19.5873C40.2747 17.2357 40.5688 13.0033 40.4338 11.8324C40.4338 11.8324 40.4342 11.4747 40.3677 11.2591C40.1492 10.5501 39.5745 10.1748 38.8223 10.1218C38.0701 10.0687 37.0717 10.4399 37.0209 11.2602C36.9794 11.9322 36.9902 13.221 36.9902 13.221C36.901 18.9074 35.6842 24.297 33.4669 28.8267C32.345 31.1185 31.3863 32.5552 30.2039 33.7161C28.9793 34.9183 28.0321 35.3996 26.8958 35.3968C25.424 35.3932 24.6582 34.6499 23.9907 32.577L23.6844 31.6263L24.0866 31.1702C24.3079 30.9194 25.0288 30.1033 25.6885 29.3568C29.8997 24.5924 32.6739 19.053 32.6972 15.3628C32.7095 13.4257 32.1075 12.2125 30.7445 11.4277C28.3054 10.0235 25.6481 10.9532 23.637 13.9144C21.315 17.3336 19.9733 22.4173 19.9598 27.8478L19.9535 30.3753L19.4734 30.8049C17.9423 32.1755 15.5314 33.5339 14.3959 33.6661C12.0885 33.9345 11.7308 31.9622 13.4299 28.3379C13.6477 27.8732 14.118 26.977 14.4751 26.3464C18.6896 18.9012 19.4131 17.1868 19.4258 14.6157C19.4305 13.6703 19.3916 13.488 19.031 12.7683C18.5873 11.8831 17.8966 11.2856 16.9417 10.9612C16.2695 10.7327 14.829 10.7344 14.1684 10.9643ZM27.7472 14.3673C26.1963 15.1328 24.1478 20.0563 23.5664 24.4154C23.4912 24.9798 23.4468 25.7343 23.4678 26.092L23.506 26.7426L24.0729 26.0316C26.3313 23.1985 28.6442 19.0798 29.2213 16.8632C29.5131 15.7423 29.5273 15.228 29.2793 14.7569C28.952 14.1353 28.4671 14.012 27.7472 14.3673Z"
                    fill="#202020"
                    fillRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    d="M87.0681 31.8784L92.194 15.8649H96.399L88.9903 37.3919H85.0657L79.6594 22.473L74.2932 37.3919H70.3686L63 15.8649H67.2049L72.4911 31.7568L78.1377 15.8649H81.2613L87.0681 31.8784Z"
                    fill="white"
                  />
                  <path
                    d="M113.754 37.3919H109.83L109.549 34.3919C108.108 36.7027 105.585 37.9189 102.421 37.9189C97.8156 37.9189 94.732 35.2027 94.732 30.9865C94.732 27.2973 97.0547 25.2703 102.141 24.7432L106.145 24.2973C107.667 24.1351 108.588 24.0135 109.269 23.8514V23.0405C109.269 20.4054 107.547 18.6622 104.423 18.6622C101.26 18.6622 99.7779 20.3243 99.4575 22.1081H95.3327C95.7732 17.7703 99.2573 15.2568 104.463 15.2568C110.11 15.2568 113.394 18.2162 113.394 23.0811V32.8108C113.394 34.1486 113.594 36.0135 113.754 37.3919ZM103.302 34.5946C106.666 34.5946 109.269 32.4054 109.269 28.5541V26.6892C108.468 27.0946 107.427 27.3784 106.145 27.5405L102.301 27.9865C101.58 28.0676 98.8969 28.5946 98.8969 31.1486C98.8969 33.0946 100.619 34.5946 103.302 34.5946Z"
                    fill="white"
                  />
                  <path
                    d="M126.201 15.2973C131.086 15.2973 134.29 18.4595 134.29 23.6081V37.3919H130.125V24.1351C130.125 21.0541 128.443 18.7432 125.159 18.7432C121.916 18.7432 119.633 21.0541 119.633 25.2297V37.3919H115.468V15.8649H119.513V18.7027C121.035 16.473 123.357 15.2973 126.201 15.2973Z"
                    fill="white"
                  />
                  <path
                    d="M152.197 18.9054V8H156.362V37.3919H152.278V34.3108C150.596 36.6216 148.033 37.9595 144.869 37.9595C138.862 37.9595 134.857 33.1757 134.857 26.6081C134.857 19.8784 139.022 15.3378 144.869 15.3378C147.993 15.3378 150.515 16.6757 152.197 18.9054ZM145.67 34.473C149.715 34.473 152.197 31.473 152.197 26.6486C152.197 21.7838 149.715 18.8243 145.67 18.8243C141.625 18.8243 139.182 21.7838 139.182 26.6486C139.182 31.473 141.625 34.473 145.67 34.473Z"
                    fill="white"
                  />
                  <path
                    d="M167.786 15.3784C174.594 15.3784 178.638 20.8108 177.717 27.9054H161.218C161.538 32 164.181 34.5946 167.866 34.5946C170.389 34.5946 172.271 33.3784 173.232 31.5541H177.477C176.075 35.4054 172.671 38 167.906 38C161.618 38 157.093 33.3378 157.093 26.7703C157.093 20.0811 161.618 15.3784 167.786 15.3784ZM167.786 18.7838C164.181 18.7838 161.699 21.2162 161.258 24.5811H173.873C173.512 21.0946 171.43 18.7838 167.786 18.7838Z"
                    fill="white"
                  />
                  <path
                    d="M188.993 15.5405C189.393 15.5405 189.754 15.5811 190.074 15.6216V19.4324H188.833C184.628 19.4324 182.746 21.2973 182.746 26.1622V37.3919H178.581V15.8649H182.625V18.9459C183.987 16.7568 186.11 15.5405 188.993 15.5405Z"
                    fill="white"
                  />
                  <path
                    d="M199.084 38C192.676 38 188.271 33.2568 188.271 26.6486C188.271 20.0405 192.676 15.2973 199.084 15.2973C205.491 15.2973 209.936 20.0405 209.936 26.6486C209.936 33.2568 205.491 38 199.084 38ZM199.084 34.473C203.128 34.473 205.611 31.5135 205.611 26.6486C205.611 21.7838 203.128 18.8243 199.084 18.8243C195.039 18.8243 192.596 21.7838 192.596 26.6486C192.596 31.5135 195.039 34.473 199.084 34.473Z"
                    fill="white"
                  />
                  <path
                    d="M220.147 38C213.74 38 209.335 33.2568 209.335 26.6486C209.335 20.0405 213.74 15.2973 220.147 15.2973C226.555 15.2973 231 20.0405 231 26.6486C231 33.2568 226.555 38 220.147 38ZM220.147 34.473C224.192 34.473 226.675 31.5135 226.675 26.6486C226.675 21.7838 224.192 18.8243 220.147 18.8243C216.103 18.8243 213.66 21.7838 213.66 26.6486C213.66 31.5135 216.103 34.473 220.147 34.473Z"
                    fill="white"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="flex-1"></div>
        
        {/* Buttons Container */}
        <div className="w-full max-w-[337px] flex flex-col gap-3 mb-4">
          {/* Sign In Button */}
          <Button
            onClick={handleSignIn}
            variant="outline"
            className="w-full h-14 bg-white text-[#202020] font-bold text-base uppercase tracking-[-0.75px] rounded-[34px] shadow-[0px_8px_15px_0px_rgba(165,93,35,0.35)] hover:bg-white/90 border-none"
          >
            SIGN IN
          </Button>

          {/* Create Account Button */}
          <Button
            onClick={handleCreateAccount}
            className="w-full h-14 text-white font-bold text-base uppercase tracking-[-0.75px] border-none hover:opacity-90"
            style={{
              borderRadius: '34px',
              background: 'radial-gradient(143.19% 143.19% at 129.17% 144.79%, #FFDECE 0%, #FF5300 100%)',
              boxShadow: '0 8px 15px 0 rgba(165, 93, 35, 0.35)'
            }}
          >
            CREATE ACCOUNT
          </Button>

          {/* Continue as Guest Button */}
          <Button
            onClick={handleContinueAsGuest}
            variant="ghost"
            className="w-full h-14 bg-transparent text-white font-bold text-base uppercase tracking-[-0.75px] rounded-[34px] border-none underline decoration-solid underline-offset-4 hover:bg-transparent hover:text-white"
          >
            CONTINUE AS GUEST
          </Button>
        </div>

        {/* Home Indicator */}
        <div className="w-[125px] h-[5px] bg-[#3d3d42] rounded-full mb-4" style={{ display: 'none' }}></div>
      </div>
    </div>
  );
};

export default GetStarted; 