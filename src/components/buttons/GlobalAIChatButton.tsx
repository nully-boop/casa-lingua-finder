import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import GlobalAIChatDrawer from "../GlobalAIChatDrawer";
import AuthModal from "../auth/AuthModal";

function GlobalAIChatButton() {
  const { isAuthenticated } = useLanguage();

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAIChat = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setIsAIChatOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        className="group relative transition-all duration-300 hover:scale-110 hover:shadow-md bg-transparent border-none p-0"
        onClick={handleAIChat}
      >
        {/* <img
          src="/icons/siri-stroke-rounded (3) (1).png"
          alt="AI Chat"
          className="h-9 w-9 transition-all duration-300 group-hover:animate-pulse"
        /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="35"
          height="35"
          viewBox="0,0,256,256"
        >
          <g
            fill="#2563eb"
            fill-rule="nonzero"
            stroke="none"
            stroke-width="1"
            stroke-linecap="butt"
            stroke-linejoin="miter"
            stroke-miterlimit="10"
            stroke-dasharray=""
            stroke-dashoffset="0"
            font-family="none"
            font-weight="none"
            font-size="none"
            text-anchor="none"
          >
            <g transform="scale(8.53333,8.53333)">
              <path d="M27.02,14.981l-1.824,-1.812l0.856,-2.424c0.435,-1.227 0.209,-2.566 -0.603,-3.583c-0.812,-1.018 -2.069,-1.531 -3.358,-1.384l-2.554,0.296l-1.36,-2.182c-0.689,-1.102 -1.876,-1.762 -3.177,-1.762c-1.301,0 -2.488,0.659 -3.177,1.763l-1.36,2.182l-2.554,-0.297c-1.287,-0.146 -2.547,0.368 -3.358,1.385c-0.812,1.017 -1.037,2.356 -0.603,3.583l0.856,2.424l-1.824,1.811c-0.922,0.916 -1.3,2.221 -1.01,3.489c0.289,1.269 1.196,2.279 2.425,2.705l2.43,0.841l0.279,2.557c0.142,1.293 0.926,2.402 2.097,2.966c1.174,0.565 2.53,0.486 3.628,-0.21l2.171,-1.376l2.172,1.375c0.613,0.387 1.305,0.583 2.001,0.583c0.553,0 1.107,-0.124 1.627,-0.374c1.171,-0.564 1.955,-1.673 2.097,-2.966l0.279,-2.556l2.43,-0.841c1.229,-0.425 2.136,-1.436 2.425,-2.705c0.289,-1.267 -0.089,-2.572 -1.011,-3.488zM22.321,7.765c0.618,-0.069 1.182,0.165 1.564,0.645c0.384,0.48 0.486,1.089 0.281,1.668l-0.635,1.794c-1.453,-1.074 -2.488,-2.359 -3.136,-3.884zM21.112,20.361c-2.394,0.292 -4.452,1.287 -6.144,2.965c-1.849,-1.716 -3.919,-2.715 -6.175,-2.98c0.062,-2.519 -0.437,-4.741 -1.486,-6.63c1.847,-1.349 3.27,-3.141 4.242,-5.347c2.273,0.659 4.567,0.664 6.841,0.017c0.812,2.121 2.235,3.901 4.244,5.312c-1.259,1.994 -1.77,4.227 -1.522,6.663zM15,4.13c0.615,0 1.154,0.299 1.479,0.821l0.998,1.601c-1.659,0.416 -3.297,0.416 -4.955,0l0.998,-1.601c0.326,-0.521 0.865,-0.821 1.48,-0.821zM6.114,8.41c0.383,-0.481 0.947,-0.715 1.564,-0.645l1.842,0.214c-0.755,1.567 -1.769,2.844 -3.063,3.863l-0.624,-1.764c-0.205,-0.579 -0.103,-1.188 0.281,-1.668zM3.919,18.025c-0.137,-0.6 0.035,-1.192 0.472,-1.625l1.351,-1.342c0.691,1.393 1.044,3.009 1.05,4.83l-1.743,-0.603c-0.581,-0.201 -0.993,-0.66 -1.13,-1.26zM11.758,25.638c-0.521,0.329 -1.136,0.365 -1.689,0.098c-0.553,-0.267 -0.91,-0.771 -0.977,-1.381l-0.215,-1.971c1.632,0.254 3.125,0.985 4.516,2.219zM19.932,25.736c-0.554,0.268 -1.169,0.231 -1.689,-0.098l-1.679,-1.063c1.283,-1.21 2.789,-1.934 4.56,-2.192l-0.215,1.971c-0.067,0.612 -0.424,1.116 -0.977,1.382zM26.081,18.025c-0.137,0.6 -0.549,1.059 -1.13,1.26l-1.864,0.645c-0.145,-1.81 0.221,-3.44 1.108,-4.935l1.415,1.405c0.436,0.433 0.608,1.026 0.471,1.625z"></path>
            </g>
          </g>
        </svg>
        <span className="absolute -top-2 -right-2 bg-success text-success-foreground text-[9px] px-1 py-0.5 rounded-full uppercase font-bold shadow-md hover:bg-success/80 transition-colors">
          new
        </span>
      </button>

      {/* AI Chat Drawer */}
      <GlobalAIChatDrawer open={isAIChatOpen} onOpenChange={setIsAIChatOpen} />

      {/* Auth Modal */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}

export default GlobalAIChatButton;
