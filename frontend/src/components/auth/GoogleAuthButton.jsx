import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

const GoogleAuthButton = ({ isRegister = false }) => {
  const navigate = useNavigate();
  const { googleAuth } = useAuthStore();
  const isLoading = useAuthStore(state => 
    isRegister ? state.isSigninUp : state.isLoggingIn
  );

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        size="large"
        shape="rectangular"
        text={isRegister ? "signup_with" : "signin_with"}
        onSuccess={async (credentialResponse) => {
          try {
            const data = await googleAuth(credentialResponse.credential, isRegister);
            
            if (data.success) {
              navigate('/', { replace: true });
            }
          } catch (error) {
            const errorMessage = error.response?.data?.message || 
                              error.message || 
                              'Authentication error';
            toast.error(errorMessage);
          }
        }}
        onError={() => {
          toast.error('Google authentication failed');
        }}
      />
      {isLoading && (
        <div className="mt-2 text-center">
          <span className="loading loading-spinner"></span>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;