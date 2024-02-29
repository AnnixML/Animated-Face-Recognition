import '../globals.css';
import {AuthProvider} from '../context/AuthContext'
import RootLayout from './layout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
    </AuthProvider>
  );
}

export default MyApp;