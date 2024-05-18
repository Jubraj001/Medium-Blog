import { Quote } from '../components/Quote';
import { Auth } from '../components/Auth';

export const Signin = () => {
  return <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
    <Auth type='signin'/>
    <Quote />
  </div>
}
