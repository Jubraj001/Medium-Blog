import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignupInput } from '@jubraj001/medium-blog-project-validations';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: ""
  });

  async function sendRequest() {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type}`, postInputs);
      const jwt = response.data;
      localStorage.setItem('token', jwt);
      navigate('/blogs');
    } catch (error) {
      alert('Error while signing up');
    }
  }

  return <div className='flex flex-col justify-center items-center gap-4'>
    <div className="flex flex-col gap-1">
      <div className="font-bold text-2xl text-center">{type === 'signup' ? 'Create an account' : 'Login to account'}</div>
      <div>
        {type === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
        <Link to={type === 'signup' ? '/signin' : '/signup'} className='underline font-light'>{type === 'signup' ? 'Login' : 'Signup'}</Link>
      </div>
    </div>
    <div className='flex flex-col gap-3 w-[34rem]'>
      <LabelledInput label="Username" placeholder="abc@gmail.com" onChange={(e) => {
        setPostInputs({
          ...postInputs,
          username: e.target.value
        })
      }}/>
      <LabelledInput label="Password" type={"password"} placeholder="password" onChange={(e) => {
        setPostInputs({
          ...postInputs,
          password: e.target.value
        })
      }}/>
      {type === 'signup' ? <LabelledInput label="Name" placeholder="Jubraj Dev" onChange={(e) => {
        setPostInputs({
          ...postInputs,
          name: e.target.value
        })
      }}/> : null}
      <button onClick={sendRequest} className="bg-slate-900 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded w-full">
        {type === 'signup' ? 'Sign up' : 'Sign in' }
      </button>
    </div>
  </div>
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: ( e: ChangeEvent<HTMLInputElement> ) => void;
  type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
  return <div>
    <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
    <input onChange={onChange} type={ type || 'text' } id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
  </div>
}
