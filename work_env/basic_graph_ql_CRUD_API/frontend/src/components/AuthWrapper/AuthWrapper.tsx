"user client"
import { ReactNode, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useCookies } from 'react-cookie';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const router = useRouter();
  // const [cookies, _] = useCookies(['AccessToken']);
  const token = localStorage.getItem('AccessTodken')
  console.log(token, "here is the recieved token")

  if(!token) {
    router.push('/login')
  }
  //   useEffect(() => {
  //   if (!token) {
  //     router.push('/login'); // Redirect to login if token doesn't exist
  //   }
  // }, [token, router]);

  return <>{children}</>;
};

export default AuthWrapper;
